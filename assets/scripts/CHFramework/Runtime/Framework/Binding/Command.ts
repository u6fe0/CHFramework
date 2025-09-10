export interface ICommand {
    execute(...args: any[]): void;
    canExecute?: (...args: any[]) => boolean;
}

export class Command implements ICommand {
    constructor(
        private _execute: (...args: any[]) => void,
        public canExecute?: (...args: any[]) => boolean
    ) {}

    execute(...args: any[]): void {
        if (!this.canExecute || this.canExecute(...args)) {
            this._execute(...args);
        }
    }
}