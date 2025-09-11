import { INotifyPropertyChanged, PropertyChangedHandler } from './INotifyPropertyChanged';

/**
 * Base class for objects that support property change notification.
 * Provides a simple implementation of INotifyPropertyChanged with helper methods.
 */
export class ObservableObject implements INotifyPropertyChanged {
    private _propertyChangedHandlers: PropertyChangedHandler[] = [];

    /**
     * Subscribe to property change notifications
     */
    onPropertyChanged(handler: PropertyChangedHandler): void {
        if (this._propertyChangedHandlers.indexOf(handler) === -1) {
            this._propertyChangedHandlers.push(handler);
        }
    }

    /**
     * Unsubscribe from property change notifications
     */
    offPropertyChanged(handler: PropertyChangedHandler): void {
        const index = this._propertyChangedHandlers.indexOf(handler);
        if (index >= 0) {
            this._propertyChangedHandlers.splice(index, 1);
        }
    }

    /**
     * Raise a property changed event
     */
    protected raisePropertyChanged(propertyName: string, newValue: any, oldValue?: any): void {
        for (const handler of this._propertyChangedHandlers) {
            handler(propertyName, newValue, oldValue);
        }
    }

    /**
     * Helper method to set a property value and raise change notification if the value changed
     */
    protected set<T>(propertyName: string, currentValue: T, newValue: T, setter: (value: T) => void): boolean {
        if (currentValue !== newValue) {
            const oldValue = currentValue;
            setter(newValue);
            this.raisePropertyChanged(propertyName, newValue, oldValue);
            return true;
        }
        return false;
    }
}