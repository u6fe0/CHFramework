import { ICommand } from "./ICommand";
/**
 * 命令基类
 * 1.封装了执行逻辑和可执行逻辑
 * 2.提供了 canExecuteChanged 事件，用于通知命令的可执行状态发生变化
 */
export abstract class CommandBase implements ICommand {
    // 执行函数
    protected _execute: (param?: any) => any;
    // 可执行判断函数
    protected _canExecute: (param?: any) => boolean;
    // canExecuteChanged 事件
    private _canExecuteChangedHandlers: Array<(param?: any) => void> = [];
    /**
     * 构造函数
     * @param execute 执行函数
     * @param canExecute 可执行判断函数
     */
    constructor(execute: (param?: any) => any, canExecute?: (param?: any) => boolean) {
        this._execute = execute;
        this._canExecute = canExecute ?? (() => true);
    }
    /**
     * 判断命令是否可执行
     * @param param 执行参数
     * @returns 是否可执行
     */
    canExecute(param: any): boolean {
        return this._canExecute ? this._canExecute(param) : true;
    }
    /**
     * 执行命令
     * @param param 执行参数
     * @returns 执行结果，如果不可执行则返回 undefined
     */
    execute(param?: any) {
        if (!this.canExecute(param)) {
            return undefined;
        }
        return this._execute(param);
    }

    /**
     * 订阅 onExecuteStateChanged 事件
     */
    public onExecuteStateChanged(handler: (param?: any) => void): void {
        if (!this._canExecuteChangedHandlers.includes(handler)) {
            this._canExecuteChangedHandlers.push(handler);
        }
    }

    /**
     * 取消订阅 onExecuteStateChanged 事件
     */
    public offExecuteStateChanged(handler: (param?: any) => void): void {
        this._canExecuteChangedHandlers = this._canExecuteChangedHandlers.filter(h => h !== handler);
    }

    /**
     * 触发 onExecuteStateChanged 事件
     */
    public raiseExecuteStateChanged = (param?: any): void => {
        for (const handler of this._canExecuteChangedHandlers) {
            handler(param);
        }
    }
}