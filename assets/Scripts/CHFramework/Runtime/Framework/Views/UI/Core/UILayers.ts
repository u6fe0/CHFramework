import { Node } from "cc";

/**
 * UI 层级枚举
 */
export enum LayerEnum {
  Normal = "normal",
  Popup = "popup",
  Overlay = "overlay",
  System = "system"
}

/**
 * 各层级节点
 */
interface LayerNodes {
  [LayerEnum.Normal]: Node;
  [LayerEnum.Popup]: Node;
  [LayerEnum.Overlay]: Node;
  [LayerEnum.System]: Node;
}

/**
 * UI 层级管理
 */
export class UILayers {
  private static _inst: UILayers;
  static get instance() {
    if (!this._inst) {
      this._inst = new UILayers();
    }
    return this._inst;
  }

  private layers: LayerNodes;

  init(root: Node) {
    const ensure = (name: string) => {
      let child = root.getChildByName(name);
      if (!child) {
        child = new Node(name);
        root.addChild(child);
      }
      return child;
    };
    this.layers = {
      normal: ensure("Layer_Normal"),
      popup: ensure("Layer_Popup"),
      overlay: ensure("Layer_Overlay"),
      system: ensure("Layer_System"),
    };
  }

  getLayerNode(layer: LayerEnum) {
    return this.layers[layer];
  }
}