import { _decorator, CCFloat, math, RichText, UIOpacity, UITransform } from 'cc';
import { ToastBase } from './ToastBase';
const { ccclass, property } = _decorator;
/**
 * RichToast
 * 自定义富文本Toast
 */
@ccclass('RichToast')
export class RichToast extends ToastBase {
    static prefabPath = "Demo_CHFramework/Prefab/UI/Toast/RichToast";
    @property(CCFloat)
    duration = 1.0; // 持续时间
    @property(CCFloat)
    delay = 0.6; // 延迟时间
    private _elapsedTime = 0.0; // 已经过去的时间
    @property(UIOpacity)
    uiOpacity: UIOpacity;
    @property(RichText)
    richText: RichText;
    @property(UITransform)
    outlineTransform: UITransform;
    @property(UITransform)
    innerTransform: UITransform;

    private _startY = 150; // 起始位置
    private _speed = 300; // 移动速度
    private _height = 0; // 当前提示框的高度

    protected onLoad(): void {
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            this._height = transform.height;
        }
    }

    init(msg: string) {
        // 为了初始时候追赶的效果 -height
        this.node.y = this._startY - this._height;
        this.richText.string = msg;

        // 根据内容调整大小
        const richTextTransform = this.richText.getComponent(UITransform);
        this.outlineTransform.width = richTextTransform.width + 40;
        this.innerTransform.width = richTextTransform.width + 30;
    }

    onBeforeNewEnqueued() {
        this._startY += this._height;
    }

    tick(dt: number): void {
        this._elapsedTime += dt;
        const translateTime = Math.max(0, this._elapsedTime - this.delay);
        const targetY = translateTime * this._speed;
        this.node.y = math.lerp(this.node.y, this._startY + targetY, dt * 6);
        const alphaDuration = this.duration - this.delay;
        this.uiOpacity.opacity = math.lerp(255, 0, translateTime / alphaDuration);
    }

    isEnd() {
        return this._elapsedTime > this.duration;
    }
}
