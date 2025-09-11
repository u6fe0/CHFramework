import { ICommand } from '../core/ICommand';

/**
 * Represents a command binding that connects UI events to commands
 */
export class CommandBinding {
    private _isDisposed: boolean = false;
    private _canExecuteHandler?: () => void;
    private _eventHandler?: (...args: any[]) => void;
    private _interactableBinding?: CommandBinding;
    
    constructor(
        public readonly target: any,
        public readonly eventName: string,
        public readonly command: ICommand,
        public readonly commandParameter?: any,
        public readonly bindInteractable: boolean = false,
        public readonly interactableProperty: string = 'interactable'
    ) {
        this.initialize();
    }
    
    private initialize(): void {
        this.bindEvent();
        
        if (this.bindInteractable) {
            this.bindCanExecute();
        }
    }
    
    private bindEvent(): void {
        if (!this.target || !this.eventName) return;
        
        this._eventHandler = (...args: any[]) => {
            if (this.command) {
                this.command.execute(this.commandParameter);
            }
        };
        
        // Handle different event binding patterns
        if (typeof this.target.on === 'function') {
            // Cocos Creator event pattern
            this.target.on(this.eventName, this._eventHandler, this);
        } else if (typeof this.target.node?.on === 'function') {
            // Cocos Creator component with node
            this.target.node.on(this.eventName, this._eventHandler, this);
        } else if (typeof this.target.addEventListener === 'function') {
            // DOM event pattern
            this.target.addEventListener(this.eventName, this._eventHandler);
        }
    }
    
    private bindCanExecute(): void {
        if (!this.command) return;
        
        this._canExecuteHandler = () => {
            this.updateInteractable();
        };
        
        this.command.onCanExecuteChanged(this._canExecuteHandler);
        
        // Initial update
        this.updateInteractable();
    }
    
    private updateInteractable(): void {
        if (this._isDisposed || !this.target) return;
        
        const canExecute = this.command.canExecute(this.commandParameter);
        
        if (this.target[this.interactableProperty] !== canExecute) {
            this.target[this.interactableProperty] = canExecute;
        }
    }
    
    /**
     * Dispose the command binding and clean up subscriptions
     */
    dispose(): void {
        if (this._isDisposed) return;
        
        // Remove event handler
        if (this._eventHandler) {
            if (typeof this.target?.off === 'function') {
                this.target.off(this.eventName, this._eventHandler, this);
            } else if (typeof this.target?.node?.off === 'function') {
                this.target.node.off(this.eventName, this._eventHandler, this);
            } else if (typeof this.target?.removeEventListener === 'function') {
                this.target.removeEventListener(this.eventName, this._eventHandler);
            }
        }
        
        // Remove can execute handler
        if (this._canExecuteHandler && this.command) {
            this.command.offCanExecuteChanged(this._canExecuteHandler);
        }
        
        this._isDisposed = true;
    }
    
    /**
     * Whether the binding has been disposed
     */
    get isDisposed(): boolean {
        return this._isDisposed;
    }
}