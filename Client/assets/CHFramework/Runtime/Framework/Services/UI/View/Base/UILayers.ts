import { Canvas, Enum, Node, Widget } from "cc";

/**
 * UI 层级枚举
 */

export const ViewType = Enum({
  FULL: "FULL", // 全屏
  POPUP: "POPUP", // 弹出
  DIALOG: "DIALOG", // 对话框
  QUEUE_POPUP: "QUEUE_POPUP", // 排队弹出
  LOADING: "LOADING" // 加载中
});
/**
 * 视图状态枚举
 */
export enum ViewState {
  NONE, // 默认状态
  CREATE_BEGIN, // 创建开始
  CREATE_END, // 创建结束
  VISIBLE, // 可见
  ENTER_ANIMATION_ING, // 进入动画中
  READY, // 就绪
  EXIT_ANIMATION_ING, // 退出动画中
  INVISIBLE, // 隐藏
  DISMISS_BEGIN, // 消失开始
  DISMISS_END // 消失结束
}

export const ToastType = Enum({
  // 纯文字
  TEXT: "TEXT",
  // 带图标
  ICON: "ICON",
  // 自定义
  CUSTOM: "CUSTOM"
});

/**
 * 各层级节点
 */
interface LayerNodes {
  [ViewType.FULL]: Node;
  [ViewType.POPUP]: Node;
  [ViewType.DIALOG]: Node;
  [ViewType.QUEUE_POPUP]: Node;
  [ViewType.LOADING]: Node;
}

/**
 * UI 层级管理
 */
export class UILayers {
  private layers: LayerNodes = {};

  constructor(canvas: Canvas) {
    const viewParent = new Node("UIViews");
    this.addWidget(viewParent);
    canvas.node.addChild(viewParent);

    this.layers = Object.values(ViewType).reduce((acc, layer) => {
      const layerNode = new Node(`Layer_${layer}`);
      this.addWidget(layerNode);
      viewParent.addChild(layerNode);
      acc[layer] = layerNode;
      return acc;
    }, {} as LayerNodes);
  }
  /**
   * 获取指定层级的节点
   * @param layer 层级
   * @returns 
   */
  getLayerNode(layer: string) {
    return this.layers[layer];
  }
  /**
   * 添加一个 Widget 组件到指定节点
   * @param node 
   * @param layer 
   */
  addWidget(node: Node) {
    const widget = node.addComponent(Widget);
    widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
    widget.isAlignLeft = true;
    widget.isAlignRight = true;
    widget.isAlignTop = true;
    widget.isAlignBottom = true;
    widget.left = 0;
    widget.right = 0;
    widget.top = 0;
    widget.bottom = 0;
  }
}