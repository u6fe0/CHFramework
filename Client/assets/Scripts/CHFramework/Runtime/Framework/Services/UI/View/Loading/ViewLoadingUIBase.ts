import { BlockInputEvents, Canvas, Node, UITransform } from "cc";

/**
 * 在View加载过程中显示的Loading界面
 */
export abstract class ViewLoadingUIBase {
    canvas: Canvas;
    node: Node;
    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.node = new Node("ViewLoadingUI");
        this.node.addComponent(BlockInputEvents);
        this.updateSize();
        this.node.active = false;
    }
    show(): void {
        this.node.active = true;
    }
    hide(): void {
        this.node.active = false;
    }
    /**
    * 更新尺寸
    */
    updateSize() {
        const canvasUITran = this.canvas.node.getComponent(UITransform);
        let selfUITran = this.node.getComponent(UITransform);
        if (!selfUITran) selfUITran = this.node.addComponent(UITransform);
        selfUITran.setContentSize(canvasUITran.width, canvasUITran.height);
    }
    // 更新进度 0~1
    abstract updateProgress(value: number): void;
}