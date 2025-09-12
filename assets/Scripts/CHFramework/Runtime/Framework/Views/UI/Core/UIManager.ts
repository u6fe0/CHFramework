import { Prefab, instantiate, Node, AssetManager } from 'cc';
import { UIKey } from './UIKey';
import { UILayers, LayerEnum } from './UILayers';
import { UIView } from './UIView';

/**
 * 活动视图缓存
 */
interface IViewCache {
    key: UIKey;
    view: UIView;
}
/**
 * UI 管理器
 */
export class UIManager {
    private static _inst: UIManager;
    static get instance() {
        if (!this._inst) this._inst = new UIManager();
        return this._inst;
    }
    // 活动视图缓存
    private viewCaches: IViewCache[] = [];
    private _openChain: Promise<any> = Promise.resolve();

    init(root: Node) {
        UILayers.instance.init(root);
    }

    async open(key: UIKey): Promise<UIView> {
        // 串行化：把真正打开逻辑放入链
        this._openChain = this._openChain.then(() => this._doOpen(key));
        return this._openChain;
    }
    /**
     * 打开一个 UI 界面
     * @param key UIKey
     * @param options 
     * @returns 
     */
    private async _doOpen(key: UIKey): Promise<UIView> {
        let bundle = AssetManager.instance.getBundle(key.bundle);
        if (!bundle) {
            bundle = await new Promise((resolve, reject) => {
                AssetManager.instance.loadBundle(key.bundle, (err, b) => {
                    if (err || !b) return reject(err);
                    resolve(b);
                });
            });
        }
        const prefab: Prefab = await new Promise((resolve, reject) => {
            bundle.load(key.path, Prefab, (err, asset) => {
                if (err || !asset) return reject(err);
                resolve(asset);
            });
        });

        const node = instantiate(prefab);
        const view = node.getComponent(UIView);
        view && view.init();
        UILayers.instance.getLayerNode(view.layer).addChild(node);
        this.viewCaches.push({ key, view });
        return view;
    }

    /**
     * 关闭一个 UI 界面
     * @param key UIKey
     * @returns 
     */
    async close(key: UIKey) {
        for (let i = this.viewCaches.length - 1; i >= 0; i--) {
            const cache = this.viewCaches[i];
            if (cache.key === key) {
                cache.view.node.removeFromParent();
                cache.view.node.destroy();
                this.viewCaches.splice(i, 1);
                return;
            }
        }
    }

    async closeAll(layer?: LayerEnum) {
        for (let i = this.viewCaches.length - 1; i >= 0; i--) {
            const cache = this.viewCaches[i];
            if (!layer || cache.view.layer === layer) {
                cache.view.node.removeFromParent();
                cache.view.node.destroy();
                this.viewCaches.splice(i, 1);
            }
        }
    }

    getOpenCount(key?: UIKey) {
        if (!key) return this.viewCaches.length;
        return this.viewCaches.filter(a => a.key === key).length;
    }
}