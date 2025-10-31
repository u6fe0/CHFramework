import { CommandBase } from "./Base/CommandBase";
/**
 * 简单命令类，支持同步执行和可执行状态管理
 */
export class SimpleCommand extends CommandBase {
    /**
     * 执行命令
     * @param param 执行参数
     * @returns 执行结果，如果不可执行则返回 undefined
     */
    execute(param?: any) {
        if (!this.canExecute || this.canExecute(param)) {
            return this._execute(param);
        }
        return undefined;
    }
}
