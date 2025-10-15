import { _decorator, CCFloat, tween, Tween, UIOpacity } from 'cc';
const { property, ccclass } = _decorator;
import { AnimationBase, AnimationType } from './Base/AnimationBase';
import { ViewBase } from '../View/Base/ViewBase';
/**
 * 淡入淡出动画
 */
@ccclass('AlphaAnimation')
export class AlphaAnimation extends AnimationBase {
    // 限制在 0-1
    @property({ type: CCFloat, range: [0, 1] })
    from = 1;
    @property({ type: CCFloat, range: [0, 1] })
    to = 1;
    @property({ type: CCFloat, tooltip: "动画持续时间" })
    duration = 2;

    private _view: ViewBase;
    protected onEnable(): void {
        this._view = this.getComponent(ViewBase);
        switch (this.animationType) {
            case AnimationType.Enter:
                this._view.EnterAnimation = this;
                break;
            case AnimationType.Exit:
                this._view.ExitAnimation = this;
                break;
        }
    }

    play() {
        let opacityComp = this.getComponent(UIOpacity);
        if (!opacityComp) opacityComp = this.addComponent(UIOpacity);
        opacityComp.opacity = this.from * 255;
        Tween.stopAllByTarget(opacityComp);
        this.onStartCallBack();
        const targetAlpha = this.to * 255;
        tween(opacityComp)
            .to(this.duration, { opacity: targetAlpha }, { easing: 'sineInOut' })
            .call(() => {
                this.onEndCallBack();
            })
            .start();
    }
}