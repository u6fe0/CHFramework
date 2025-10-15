import { Component, Enum, _decorator } from "cc";
import { AnimationType } from "./AnimationType";
import { IAnimation } from "./IAnimation";
const { property } = _decorator;
export { AnimationType } from "./AnimationType";
/**
 * 动画基类
 */
export abstract class AnimationBase extends Component implements IAnimation {
    @property({ type: Enum(AnimationType) })
    public animationType: AnimationType = AnimationType.Enter;

    _onStart: (() => void) | null = null;
    _onEnd: (() => void) | null = null;

    public onStart(onStart: () => void): void {
        this._onStart = onStart;
    }

    public onEnd(onEnd: () => void): void {
        this._onEnd = onEnd;
    }


    public onStartCallBack(): void {
        try {
            if (this._onStart) {
                this._onStart();
                this._onStart = null;
            }
        } catch (error) {
            console.error('Error setting OnStart callback:', error);
        }
    }
    public onEndCallBack(): void {
        try {
            if (this._onEnd) {
                this._onEnd();
                this._onEnd = null;
            }
        } catch (error) {
            console.error('Error setting OnEnd callback:', error);
        }
    }
    abstract play();
}
