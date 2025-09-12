import { Node, director } from "cc";

export enum LayerEnum {
  Normal = "normal",
  Popup = "popup",
  Overlay = "overlay",
  System = "system"
}

interface LayerNodes {
  [LayerEnum.Normal]: Node;
  [LayerEnum.Popup]: Node;
  [LayerEnum.Overlay]: Node;
  [LayerEnum.System]: Node;
}

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
    // 已存在则直接使用
    const ensure = (name: string) => {
      let n = root.getChildByName(name);
      if (!n) {
        n = new Node(name);
        root.addChild(n);
      }
      return n;
    };
    this.layers = {
      normal: ensure("Layer_Normal"),
      popup: ensure("Layer_Popup"),
      overlay: ensure("Layer_Overlay"),
      system: ensure("Layer_System"),
    };
  }

  /** 如果还没 init，则尝试用场景第一个根结点自动初始化 */
  private ensure() {
    if (this.layers) return;
    const scene = director.getScene();
    if (!scene || scene.children.length === 0) {
      throw new Error('[UILayers] cannot auto-initialize (scene empty). Call UILayers.instance.init(rootNode) first.');
    }
    this.init(scene.children[0]);
  }

  getLayerNode(layer: LayerEnum) {
    this.ensure();
    const l = this.layers;
    return l[layer];
  }
}