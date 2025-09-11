/**
 * Handler for can execute changed events
 */
export type CanExecuteChangedHandler = () => void;

/**
 * Represents a command that can be executed and provides can execute changed notification
 */
export interface ICommand {
    /**
     * Execute the command
     */
    execute(parameter?: any): void;

    /**
     * Determines whether the command can execute
     */
    canExecute(parameter?: any): boolean;

    /**
     * Subscribe to can execute changed notifications
     */
    onCanExecuteChanged(handler: CanExecuteChangedHandler): void;

    /**
     * Unsubscribe from can execute changed notifications
     */
    offCanExecuteChanged(handler: CanExecuteChangedHandler): void;
}

/**
 * Base command implementation
 */
export class Command implements ICommand {
    private _canExecuteChangedHandlers: CanExecuteChangedHandler[] = [];
    private _executeAction: (parameter?: any) => void;
    private _canExecuteAction?: (parameter?: any) => boolean;

    constructor(
        executeAction: (parameter?: any) => void,
        canExecuteAction?: (parameter?: any) => boolean
    ) {
        this._executeAction = executeAction;
        this._canExecuteAction = canExecuteAction;
    }

    execute(parameter?: any): void {
        if (this.canExecute(parameter)) {
            this._executeAction(parameter);
        }
    }

    canExecute(parameter?: any): boolean {
        return this._canExecuteAction ? this._canExecuteAction(parameter) : true;
    }

    onCanExecuteChanged(handler: CanExecuteChangedHandler): void {
        if (this._canExecuteChangedHandlers.indexOf(handler) === -1) {
            this._canExecuteChangedHandlers.push(handler);
        }
    }

    offCanExecuteChanged(handler: CanExecuteChangedHandler): void {
        const index = this._canExecuteChangedHandlers.indexOf(handler);
        if (index >= 0) {
            this._canExecuteChangedHandlers.splice(index, 1);
        }
    }

    /**
     * Raise can execute changed event
     */
    raiseCanExecuteChanged(): void {
        for (const handler of this._canExecuteChangedHandlers) {
            handler();
        }
    }
}

/**
 * Async command implementation (ES5 compatible)
 */
export class AsyncCommand implements ICommand {
    private _canExecuteChangedHandlers: CanExecuteChangedHandler[] = [];
    private _executeAction: (parameter?: any, callback?: () => void) => void;
    private _canExecuteAction?: (parameter?: any) => boolean;
    private _isExecuting: boolean = false;

    constructor(
        executeAction: (parameter?: any, callback?: () => void) => void,
        canExecuteAction?: (parameter?: any) => boolean
    ) {
        this._executeAction = executeAction;
        this._canExecuteAction = canExecuteAction;
    }

    execute(parameter?: any): void {
        if (this.canExecute(parameter)) {
            this._isExecuting = true;
            this.raiseCanExecuteChanged();
            
            this._executeAction(parameter, () => {
                this._isExecuting = false;
                this.raiseCanExecuteChanged();
            });
        }
    }

    canExecute(parameter?: any): boolean {
        if (this._isExecuting) {
            return false;
        }
        return this._canExecuteAction ? this._canExecuteAction(parameter) : true;
    }

    onCanExecuteChanged(handler: CanExecuteChangedHandler): void {
        if (this._canExecuteChangedHandlers.indexOf(handler) === -1) {
            this._canExecuteChangedHandlers.push(handler);
        }
    }

    offCanExecuteChanged(handler: CanExecuteChangedHandler): void {
        const index = this._canExecuteChangedHandlers.indexOf(handler);
        if (index >= 0) {
            this._canExecuteChangedHandlers.splice(index, 1);
        }
    }

    /**
     * Raise can execute changed event
     */
    raiseCanExecuteChanged(): void {
        for (const handler of this._canExecuteChangedHandlers) {
            handler();
        }
    }

    /**
     * Whether the command is currently executing
     */
    get isExecuting(): boolean {
        return this._isExecuting;
    }
}