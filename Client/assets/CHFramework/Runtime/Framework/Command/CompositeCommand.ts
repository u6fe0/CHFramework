import { CommandBase } from "./Base/CommandBase";
/**
 * 复合命令类，支持多个子命令的组合执行
 */
export class CompositeCommand extends CommandBase {
    private _commands: CommandBase[] = [];
    constructor() {
        super(() => { }, () => true);
    }

    /**
     * 注册子命令
     * @param command 子命令实例
     */
    registerCommand(command: CommandBase) {
        if (!command) {
            console.error("命令不能为空");
            return;
        }
        if (command === this) {
            console.error("不能添加自己为子命令");
            return;
        }
        if (this._commands.includes(command)) {
            console.warn("命令已存在，无法重复添加");
            return;
        }

        this._commands.push(command);

        // 订阅子命令的 canExecuteChanged 事件
        command.onExecuteStateChanged(this.onExecuteStateChanged.bind(this));
        // 触发一次状态更新，确保初始状态正确
        this.raiseExecuteStateChanged();
    }
    /**
     * 注销子命令
     * @param command 
     * @returns 
     */
    unregisterCommand(command: CommandBase) {
        const index = this._commands.indexOf(command);
        if (index === -1) {
            console.warn("命令不存在，无法注销");
            return;
        }
        this._commands.splice(index, 1);
    }

    /**
     * 执行所有子命令
     */
    async execute(param?: any): Promise<any[]> {
        const results: any[] = [];
        for (const command of this._commands) {
            const result = command.execute(param);
            // 如果是 Promise，则等待
            if (result instanceof Promise) {
                results.push(await result);
            } else {
                results.push(result);
            }
        }
        return results;
    }

    /**
     * 判断是否所有子命令都可执行
     */
    canExecute(param?: any): boolean {
        return this._commands.every(command => command.canExecute(param));
    }
}