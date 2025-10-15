/**
 * 动画接口
 */
export interface IAnimation {
    /**
     * 动画开始回调
     * @param onStart 动画开始回调
     */
    onStart(onStart: () => void): void;
    /**
     * 动画结束回调
     * @param onEnd 动画结束回调
     */
    onEnd(onEnd: () => void): void;
    /**
     * 播放动画
     */
    play();
}