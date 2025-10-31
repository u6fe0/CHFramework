import { Canvas, director, Prefab, Node, instantiate, game, Component } from "cc";
import { ToastBase } from "./ToastBase";
import { GameUtil } from "../../../Runtime/Framework";

interface ToastOptions {
    message: string;
}
/**
 * 提示服务
 * 统一管理提示的展示动画
 */
export class ToastService {
    private _toastList: ToastBase[] = [];
    private _queue: ToastOptions[] = [];
    // 预制体
    private _toastPrefab: Prefab = null;
    // 根节点
    private _toastRoot: Node = null
    constructor(ToastClass: typeof ToastBase) {
        GameUtil.loadResource(ToastClass.prefabPath, Prefab).then(this.onReady.bind(this));
    }
    /**
     * 资源就绪，开始
     * @param prefab 预制体
     */
    onReady(prefab: Prefab) {
        this._toastPrefab = prefab;
        const scene = director.getScene();
        let canvas: Canvas = null;
        for (const node of scene.children) {
            canvas = node.getComponent(Canvas);
            if (canvas) break;
        }
        if (!canvas) throw new Error('[ToastService] 当前场景中未找到 Canvas 节点，无法初始化。');
        const toastRoot = new Node("UIToastRoot");
        canvas.node.addChild(toastRoot);
        this._toastRoot = toastRoot;
        this.tick();
    }
    /**
     * 显示提示
     * @param options 提示配置
     */
    showToast(options: ToastOptions) {
        this._queue.push(options);
    }
    /**
    * 每帧调用
    */
    private async tick() {
        this.spawnToast();
        this.playAnimation();
        await GameUtil.waitAFrame();
        this.tick();
    }
    /**
     * 播放动画
     * @returns 资源是否就绪
     */
    private async playAnimation() {
        if (this._toastList.length <= 0) {
            return;
        }
        const deltaTime = game.deltaTime;
        this._toastList.forEach((toast, index) => {
            toast.tick(deltaTime);
            if (toast.isEnd()) {
                toast.node.destroy();
                this._toastList.splice(index, 1);
            }
        });
    }
    /**
     * 生成 Toast
     * @param options 
     * @returns 
     */
    private spawnToast() {
        const options = this._queue.shift();
        if (!options) {
            return;
        }
        const toastNode = instantiate(this._toastPrefab);
        this._toastRoot.addChild(toastNode);
        const toast = toastNode.getComponent(ToastBase);
        toast.init(options.message);

        this._toastList.forEach(toast => {
            toast.onBeforeNewEnqueued();
        });

        this._toastList.push(toast);
    }
}