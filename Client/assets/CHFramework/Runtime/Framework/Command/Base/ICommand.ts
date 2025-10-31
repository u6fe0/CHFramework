/**
 * 命令接口
 */
export interface ICommand {
    // 判断命令是否可执行
    canExecute(param?: any): boolean;
    // 执行命令
    execute(param?: any): any | undefined;
}