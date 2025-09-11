import { _decorator, Component } from 'cc';
import { INotifyPropertyChanged } from '../core/INotifyPropertyChanged';

const { ccclass, property } = _decorator;

/**
 * BindingContext component that hosts a ViewModel for data binding.
 * Attach this to a Node to provide a data context for binding operations.
 * Mirrors Loxodon Framework's View.BindingContext pattern.
 */
@ccclass('BindingContext')
export class BindingContext extends Component {
    private _dataContext: any = null;
    
    /**
     * The data context (ViewModel) for this binding context
     */
    get dataContext(): any {
        return this._dataContext;
    }
    
    set dataContext(value: any) {
        if (this._dataContext !== value) {
            this._dataContext = value;
            this.onDataContextChanged();
        }
    }
    
    /**
     * Called when the data context changes
     */
    protected onDataContextChanged(): void {
        // Override in derived classes if needed
        // This can be used to automatically refresh bindings
    }
    
    /**
     * Get the BindingContext from a node hierarchy
     */
    static findContext(node: any): BindingContext | null {
        let current = node;
        while (current) {
            const context = current.getComponent(BindingContext);
            if (context) {
                return context;
            }
            current = current.parent;
        }
        return null;
    }
    
    /**
     * Get the data context from a node hierarchy
     */
    static findDataContext(node: any): any {
        const context = BindingContext.findContext(node);
        return context ? context.dataContext : null;
    }
}