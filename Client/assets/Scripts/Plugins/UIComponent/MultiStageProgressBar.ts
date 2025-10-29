import { _decorator, CCFloat, CCInteger, ProgressBar } from "cc";
const { ccclass, property, menu } = _decorator;
/**
 * author: CHFramework
 * 多段进度条组件
 * 支持将进度条分为多个阶段，每个阶段可以有不同的长度和进度值
 * 例如：一个三段进度条，第一段占总长度的30%，进度值为0.5，第二段占50%，进度值为0.3，第三段占20%，进度值为0.2
 * 则当设置整体进度为0.6时，实际显示的进度条长度为：第一段满，第二段进度为0.2（0.3/0.5），第三段未开始
 */
@ccclass("MultiStageProgressBar")
@menu('CHFramework/UI/MultiStageProgressBar')
export class MultiStageProgressBar extends ProgressBar {
  @property({ type: [CCFloat], tooltip: "每个阶段的进度值" })
  private stageProgress: number[] = [];
  @property({ type: [CCInteger], tooltip: "每个阶段的长度" })
  private stageLength: number[] = [];
  private realProgress = 0;
  onLoad() {
    if (this.stageProgress.length !== this.stageLength.length) {
      console.error("stageProgress.length !== stageLength.length");
      return;
    }
    if (super.onLoad) {
      super.onLoad();
    }
  }
  /**
   * 重写 progress 属性，支持多段进度条
   */
  get progress() {
    if (this.stageProgress.length === 0) {
      return this._progress;
    }
    return this.realProgress;
  }
  /**
   * 重写 progress 属性，支持多段进度条
   */
  set progress(value: number) {
    if (this.stageProgress.length === 0) {
      super.progress = value;
      return;
    }
    this.realProgress = value;
    let lastProgress = 0;
    let lastLength = 0;
    const stageProgress = this.stageProgress.concat([1]);
    const stageLength = this.stageLength.concat([this.totalLength]);
    for (let i = 0; i < stageProgress.length; i++) {
      const stageProgressValue = stageProgress[i];
      const stageLengthValue = stageLength[i];
      const curValue = value - lastProgress;
      const curStageProgressValue = stageProgressValue - lastProgress;
      const curStageLength = stageLengthValue - lastLength;
      if (curValue <= curStageProgressValue) {
        const ratio = curValue / curStageProgressValue;
        const barLength = curStageLength * ratio + lastLength;
        const fakeProgress = barLength / this.totalLength;
        // super.progress = fakeProgress;
        // 不使用父类方法，在移动平台会递归调用
        if (this._progress === fakeProgress) {
          return;
        }
        this._progress = fakeProgress;
        this._updateBarStatus();
        break;
      }
      lastProgress = stageProgressValue;
      lastLength = stageLengthValue;
    }
  }
}
