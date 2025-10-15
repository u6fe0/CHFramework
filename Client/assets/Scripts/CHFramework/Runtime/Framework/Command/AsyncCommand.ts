import { CommandBase } from "./Base/CommandBase";
/**
 * 异步命令类，支持异步执行和执行状态管理
 */
export class AsyncCommand extends CommandBase {
    private _isExecuting = false;
    /**
     * 执行异步命令
     * @param param 执行参数
     * @returns 是否可执行
     */
    async execute(param?: any): Promise<boolean> {
        if (this.canExecute(param)) {
            this._isExecuting = true;
            this.raiseExecuteStateChanged();
            await this._execute(param);
            this._isExecuting = false;
            this.raiseExecuteStateChanged();
            return true;
        } else {
            return false;
        }
    }
    /**
     * 判断命令是否可执行
     * @param param 执行参数
     * @returns 是否可执行
     */
    canExecute(param?: any): boolean {
        return !this._isExecuting && this._canExecute(param);
    }
}