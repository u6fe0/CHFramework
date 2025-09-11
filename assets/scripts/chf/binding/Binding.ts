import { BindingMode, IValueConverter } from './BindingMode';
import { PropertyTargets } from '../targets/ComponentTargets';

/**
 * Represents a data binding between a source and target
 */
export class Binding {
    private _isDisposed: boolean = false;
    private _sourceHandler?: (propertyName: string, newValue: any, oldValue?: any) => void;
    private _targetHandler?: () => void;
    
    constructor(
        public readonly source: any,
        public readonly sourcePath: string,
        public readonly target: any,
        public readonly targetPath: string,
        public readonly mode: BindingMode = BindingMode.OneWay,
        public readonly converter?: IValueConverter,
        public readonly converterParameter?: any
    ) {
        this.initialize();
    }
    
    private initialize(): void {
        if (this.mode === BindingMode.OneWay || this.mode === BindingMode.TwoWay) {
            this.bindSourceToTarget();
        }
        
        if (this.mode === BindingMode.TwoWay) {
            this.bindTargetToSource();
        }
        
        if (this.mode === BindingMode.OneTime) {
            this.bindOnce();
        }
    }
    
    private bindSourceToTarget(): void {
        // Subscribe to source property changes
        if (this.source && typeof this.source.onPropertyChanged === 'function') {
            this._sourceHandler = (propertyName: string) => {
                if (propertyName === this.sourcePath || this.sourcePath.indexOf(propertyName + '.') === 0) {
                    this.updateTarget();
                }
            };
            this.source.onPropertyChanged(this._sourceHandler);
        }
        
        // Initial update
        this.updateTarget();
    }
    
    private bindTargetToSource(): void {
        // For target to source binding, we need to use component-specific change handlers
        const propertyTarget = PropertyTargets.getForComponent(this.target, this.targetPath);
        if (propertyTarget && propertyTarget.onChange) {
            this._targetHandler = () => {
                this.updateSource();
            };
            propertyTarget.onChange(this.target, this._targetHandler);
        }
    }
    
    private bindOnce(): void {
        this.updateTarget();
    }
    
    private updateTarget(): void {
        if (this._isDisposed) return;
        
        const sourceValue = this.getPropertyValue(this.source, this.sourcePath);
        let convertedValue = sourceValue;
        
        if (this.converter) {
            convertedValue = this.converter.convert(sourceValue, null, this.converterParameter);
        }
        
        this.setPropertyValue(this.target, this.targetPath, convertedValue);
    }
    
    private updateSource(): void {
        if (this._isDisposed) return;
        
        const targetValue = this.getPropertyValue(this.target, this.targetPath);
        let convertedValue = targetValue;
        
        if (this.converter && this.converter.convertBack) {
            convertedValue = this.converter.convertBack(targetValue, null, this.converterParameter);
        }
        
        this.setPropertyValue(this.source, this.sourcePath, convertedValue);
    }
    
    private getPropertyValue(obj: any, path: string): any {
        if (!obj || !path) return undefined;
        
        const parts = path.split('.');
        let current = obj;
        
        for (const part of parts) {
            if (current == null) return undefined;
            current = current[part];
        }
        
        return current;
    }
    
    private setPropertyValue(obj: any, path: string, value: any): void {
        if (!obj || !path) return;
        
        // Try to use PropertyTargets for Cocos Creator components
        const propertyTarget = PropertyTargets.getForComponent(obj, path);
        if (propertyTarget) {
            propertyTarget.set(obj, value);
            return;
        }
        
        // Fallback to generic property access
        const parts = path.split('.');
        let current = obj;
        
        for (let i = 0; i < parts.length - 1; i++) {
            if (current[parts[i]] == null) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        
        const lastPart = parts[parts.length - 1];
        if (current[lastPart] !== value) {
            current[lastPart] = value;
        }
    }
    
    /**
     * Dispose the binding and clean up subscriptions
     */
    dispose(): void {
        if (this._isDisposed) return;
        
        if (this._sourceHandler && this.source && typeof this.source.offPropertyChanged === 'function') {
            this.source.offPropertyChanged(this._sourceHandler);
        }
        
        if (this._targetHandler) {
            const propertyTarget = PropertyTargets.getForComponent(this.target, this.targetPath);
            if (propertyTarget && propertyTarget.offChange) {
                propertyTarget.offChange(this.target, this._targetHandler);
            }
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