import { _decorator, Animation, AnimationClip } from 'cc';
const { property, ccclass } = _decorator;
import { AnimationBase, AnimationType } from './Base/AnimationBase';
import { ViewBase } from '../View/Base/ViewBase';
/**
 * CCAnimation 动画
 */
@ccclass('CCAnimation')
export class CCAnimation extends AnimationBase {
    @property({ type: AnimationClip })
    clip: AnimationClip = null;
    
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
    /**
     * Play the animation clip.
     * @returns A promise that resolves when the animation is complete.
    */
    play() {
        let anim = this.getComponent(Animation);
        if (!anim) anim = this.addComponent(Animation);
        anim.defaultClip = this.clip;
        this.onStartCallBack();
        anim.play();
        anim.once(Animation.EventType.FINISHED, () => {
            this.onEndCallBack();
        });
    }
}