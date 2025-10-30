import { _decorator, Label, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;
import { ResUtil } from '../../../../CHFramework/Framework';
import { Item } from "db://assets/Scripts/Plugins/UIComponent/CHScrollView";
/**
 * CardItem数据结构
 */
export class CardItemData {
  name: string;
  icon: string;
}
// assetbundle name
const bundleName = "resources";
// 资源路径
const iconPath = "Demo_CHFramework/Texture/Shop/Icons/";
/**
 * Item 组件
 */
@ccclass("CardItem")
export class CardItem extends Item {
  @property(Label)
  nameLb: Label;
  @property(Sprite)
  iconSp: Sprite;
  private data: CardItemData;
  /**
   * 初始化
   */
  public async init(data: CardItemData) {
    this.data = data;
    this.nameLb.string = this.data.name;
    this.iconSp.spriteFrame = null;
    const sf = await ResUtil.loadBundleRes(
      bundleName,
      iconPath + this.data.icon + "/spriteFrame",
      SpriteFrame
    );
    if (this.isValid === false) return;
    this.iconSp.spriteFrame = sf;
  }
}
