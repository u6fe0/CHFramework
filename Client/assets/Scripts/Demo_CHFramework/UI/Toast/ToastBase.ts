import { Component } from "cc";
/**
 * ToastBase
 */
export abstract class ToastBase extends Component {
    /**
     * 预制体路径
     */
    static prefabPath: string = "";
    /**
     * 初始化Toast
     * @param msg 提示信息
     */
    abstract init(msg: string);
    /**
     * 每帧调用
     * @param dt 
     */
    abstract tick(dt: number): void;
    /**
     * 在新的toast插入之前调用
     */
    abstract onBeforeNewEnqueued(): void;
    /**
     * 判断生命周期
     */
    abstract isEnd(): boolean;
}