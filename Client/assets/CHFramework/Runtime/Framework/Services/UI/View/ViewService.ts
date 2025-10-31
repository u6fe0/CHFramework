import { Prefab, instantiate, AssetManager, director, Canvas, Vec3, Button } from 'cc';
import { UIKey } from './Base/UIKey';
import { UILayers, ViewState, ViewType } from './Base/UILayers';
import { ViewBase } from './Base/ViewBase';
import { UIMaskBase } from './Mask/UIMaskBase';
import { DarkMask } from './Mask/DarkMask';
import { ViewLoadingUIBase } from './Loading/ViewLoadingUIBase';
import { DefaultViewUILoading } from './Loading/DefaultViewUILoading';
/**
 * 视图缓存
 */
interface IViewCache {
    key: UIKey;
    view: ViewBase;
}
/**
 * 视图配置
 */
interface IViewConfig {
    ViewLoadingUIClass: new (canvas: Canvas) => ViewLoadingUIBase;
}

/**
 * 界面管理器
 */
export class ViewService {
    private _viewCaches: IViewCache[] = [];
    private _openChain: Promise<any> = Promise.resolve();
    private _layers: UILayers;
    private _maskUI: UIMaskBase;
    private _viewLoadingUI: ViewLoadingUIBase;

    constructor(config: IViewConfig = { ViewLoadingUIClass: DefaultViewUILoading }) {
        const scene = director.getScene();
        let canvas: Canvas = null;
        for (const node of scene.children) {
            canvas = node.getComponent(Canvas);
            if (canvas) break;
        }
        if (!canvas) throw new Error('[ViewService] 当前场景中未找到 Canvas 节点，无法初始化。');
        this._layers = new UILayers(canvas);
        this._maskUI = new DarkMask(canvas);
        this._maskUI.node.on(Button.EventType.CLICK, this.maskClick.bind(this));

        this._viewLoadingUI = new config.ViewLoadingUIClass(canvas);
        this._layers.getLayerNode(ViewType.LOADING).addChild(this._viewLoadingUI.node);
    }
    /**
     * 打开一个 UI 界面
     * @param key UIKey
     * @param options 
     * @returns 
     */
    async openUI(key: UIKey, param = {}): Promise<ViewBase> {
        this._openChain = this._openChain.then(async () => {
            const result = await this._doOpen(key, param);
            this.updateMask();
            return result;
        });
        return this._openChain;
    }
    /**
     * 执行打开 UI 界面
     */
    private async _doOpen(key: UIKey, param = {}): Promise<ViewBase> {
        // 已打开，直接返回
        const cache = this.getUI(key);
        if (cache) {
            const targetIndex = cache.node.parent.children.length - 1;
            cache.node.setSiblingIndex(targetIndex);
            cache.param = param;
            cache.show();
            return cache;
        }
        const prefab = await this.loadViewPrefab(key);
        const node = instantiate(prefab);
        const view = node.getComponent(ViewBase);
        if (!view) throw new Error(`[ViewService] 预制体 ${key.path} 上未找到 ViewBase 组件。`);
        this._layers.getLayerNode(view.type).addChild(node);
        view.node.position = Vec3.ZERO;
        this._viewCaches.push({ key, view });
        view.param = param;
        view.create();
        view.show();
        return view;
    }
    /**
     * 关闭一个 UI 界面
     * @param key UIKey
     * @returns 
     */
    async closeUI(key: UIKey) {
        for (let i = this._viewCaches.length - 1; i >= 0; i--) {
            const cache = this._viewCaches[i];
            if (cache.key === key) {
                cache.view.hide();
                this._viewCaches.splice(i, 1);
                this.updateMask();
                return;
            }
        }
    }
    /**
     * 更新遮罩
     */
    private updateMask() {
        let topView: ViewBase = null;
        for (let i = this._viewCaches.length - 1; i >= 0; i--) {
            const cache = this._viewCaches[i];
            if (cache.view.type == ViewType.POPUP || cache.view.type == ViewType.DIALOG) {
                topView = cache.view;
                break;
            }
        }
        this._maskUI.node.active = !!topView;
        if (topView) {
            this._maskUI.node.parent = topView.node.parent;
            const maskIndex = Math.max(0, topView.node.getSiblingIndex() - 1);
            this._maskUI.node.setSiblingIndex(maskIndex);
            this._maskUI.onShow();
        } else {
            this._maskUI.onHide();
        }
    }
    /**
     * 获取当前最上层的遮罩视图
     * @returns 
     */
    private getTopMaskViewCache(): IViewCache | null {
        for (let i = this._viewCaches.length - 1; i >= 0; i--) {
            const cache = this._viewCaches[i];
            if (cache.view.type === ViewType.POPUP || cache.view.type === ViewType.DIALOG) {
                return cache;
            }
        }
        return null;
    }
    /**
     * 移除一个 UI 界面
     * @param view 
     * @returns 
     */
    private remove(view: ViewBase) {
        for (let i = this._viewCaches.length - 1; i >= 0; i--) {
            const cache = this._viewCaches[i];
            if (cache.view === view) {
                this._viewCaches.splice(i, 1);
                return;
            }
        }
    }
    /**
     * 获取已打开的 UI 界面
     * @param key 
     * @returns 
     */
    private getUI(key: UIKey): ViewBase | null {
        const cache = this._viewCaches.find(a => a.key === key);
        if (cache) return cache.view;
        return null;
    }
    /**
     * 加载界面预制体
     * @param key 
     * @returns 
     */
    private loadViewPrefab(key: UIKey): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            let bundle = AssetManager.instance.getBundle(key.bundle);
            if (!bundle) {
                return reject(new Error(`[ViewService] 未找到 bundle: ${key.bundle}`));
            }
            this._viewLoadingUI.show();
            bundle.load(key.path, (finished: number, total: number) => {
                this._viewLoadingUI.updateProgress(finished / total);
            }, (err, asset) => {
                this._viewLoadingUI.hide();
                if (err || !asset) {
                    return reject(new Error(`[ViewService] 加载 prefab 失败: ${key.path}`));
                }
                resolve(asset as Prefab);
            });
        });
    }
    /**
     * 遮罩点击
     * @returns 
     */
    private maskClick() {
        const topViewCache = this.getTopMaskViewCache();
        if (!topViewCache) return;
        if (topViewCache.view.state == ViewState.READY) {
            if (topViewCache.view.IsMaskClickable) {
                this.closeUI(topViewCache.key);
            }
        }
    }
}