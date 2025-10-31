import { Component, Node, Canvas, UITransform, Color, BlockInputEvents, Button } from "cc";

/**
 * UI 遮罩类型
 */
export enum MaskType {
    None = 0, // 无遮罩
    Dark = 1, // 深色遮罩
}

export abstract class UIMaskBase {
    maskType: MaskType = MaskType.None;
    node: Node;
    canvas: Canvas;
    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.node = new Node("Mask");
        this.node.addComponent(BlockInputEvents);
        this.node.addComponent(Button);
        this.node.active = false;
    }
    /**
     * 更新遮罩尺寸
     */
    updateSize() {
        const canvasUITran = this.canvas.node.getComponent(UITransform);
        this.node.setParent(this.canvas.node);
        const selfUITran = this.node.getComponent(UITransform);
        selfUITran.setContentSize(canvasUITran.width, canvasUITran.height);
    }
    /**
     * 显示遮罩
     */
    onShow() {
    }
    /**
     * 隐藏遮罩
     */
    onHide() {
    }
}