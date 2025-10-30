import {
  _decorator,
  ScrollView,
  Prefab,
  UITransform,
  instantiate,
  Vec3,
  Vec2,
  Size,
  Rect,
  Component,
} from "cc";
const { ccclass, property, menu } = _decorator;

/**
 * author: CHFramework
 * 高性能ScrollView组件
 * 继承自cc.ScrollView
 */
interface ItemInterface {
  init(data: any): void;
}

export class Item extends Component implements ItemInterface {
  init(data: any): void {
    throw new Error("Method not implemented.");
  }
}

@ccclass("CHScrollView")
@menu('CHFramework/UI/CHScrollView')
export class CHScrollView extends ScrollView {
  // item 预制体
  @property({ type: Prefab, tooltip: 'item 预制体' })
  itemPrefab: Prefab;
  @property({ type: UITransform, tooltip: '遮罩组件' })
  maskTran: UITransform;
  // 垂直方向上最多显示的Item个数
  private verticalMaxCnt = 0;
  // 水平方向上最多显示的Item个数
  private horizontalMaxCnt = 0;
  // Item 起始位置
  private startPos = Vec3.ZERO;
  // 间距
  private itemSize: Size;
  private itemPool: Array<Item> = new Array();
  // 数据源
  private dataArray: Array<any>;
  // 用来记录Item状态
  private itemMap = new Map<any, Item>();
  // 由遮罩构建的矩形
  private maskRect = new Rect();
  /**
   * 初始化
   * note: dataArray为any数组，以应对不同结构的"itemData"
   */
  init(dataArray: Array<any>) {
    this.dataArray = dataArray;
    this.dataArray.forEach((data) => {
      this.itemMap.set(data, null);
    });
    // 计算mask的区域，是决定Item可显示个数因素之一
    // 计算Item占用区域大小
    const itemTran = this.itemPrefab.data.getComponent(
      UITransform
    ) as UITransform;
    this.itemSize = itemTran.contentSize;
    this.verticalMaxCnt =
      Math.floor(this.maskTran.height / itemTran.height) + 1;
    // 水平方向上最多显示的Item个数
    this.horizontalMaxCnt =
      Math.floor(this.maskTran.width / itemTran.width) + 1;
    const horizontalCnt = this.horizontalMaxCnt - 1;

    const contentTran = this.content.getComponent(UITransform);
    const height =
      itemTran.height * Math.ceil(this.itemMap.size / horizontalCnt);
    const width = itemTran.width * horizontalCnt;
    // 重新计算content范围
    contentTran.setContentSize(width, height);
    // 计算起始点
    const startX =
      -contentTran.width * contentTran.anchorX +
      itemTran.width * itemTran.anchorX;
    const startY =
      contentTran.height * (1 - contentTran.anchorY) -
      itemTran.height * itemTran.anchorY;

    this.startPos = new Vec3(startX, startY);

    this.maskRect.width = this.maskTran.width;
    this.maskRect.height = this.maskTran.height;
    this.maskRect.center = new Vec2(
      this.maskTran.node.worldPosition.x,
      this.maskTran.node.worldPosition.y
    );
    this.refreshItem();
    // 监听滚动
    this.node.on("scrolling", this.refreshItem, this);
  }
  /**
   * 刷新Item
   * 进一步优化方向：可以累积滑动距离超出item.height时才触发
   */
  private refreshItem() {
    const horizontalCnt = this.horizontalMaxCnt - 1;
    for (let i = 0; i < this.dataArray.length; i++) {
      const data = this.dataArray[i];

      const n = i % horizontalCnt;
      const m = Math.floor(i / horizontalCnt);
      const localPos = this.startPos
        .clone()
        .add3f(this.itemSize.width * n, -this.itemSize.height * m, 0);
      const worldPos = this.content
        .getComponent(UITransform)
        .convertToWorldSpaceAR(localPos);

      const item = this.itemMap.get(data);
      const isVisible = this.isVisible(worldPos);
      if (isVisible) {
        // 可见，却没有显示item，则实例化
        if (!item) {
          let item = this.itemPool.pop();
          if (!item) {
            const temp = instantiate(this.itemPrefab);
            item = temp.getComponent(Item);
          }
          item.node.active = true;
          item.node.parent = this.content;
          item.node.position = localPos;
          item && item.init(data);
          this.itemMap.set(data, item);
        }
      } else {
        // 不可见，却存在item，则回收
        if (item) {
          item.node.active = false;
          this.itemPool.push(item);
          this.itemMap.set(data, null);
        }
      }
    }
  }
  // 参与运算临时变量
  itemTempRect = new Rect();
  /**
   * Item是否可见
   */
  private isVisible(worldPos: Vec3): boolean {
    this.itemTempRect.width = this.itemSize.width;
    this.itemTempRect.height = this.itemSize.height;
    this.itemTempRect.center = new Vec2(worldPos.x, worldPos.y);
    return this.maskRect.intersects(this.itemTempRect);
  }
}
