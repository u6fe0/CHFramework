/**
 * Interface for objects that notify when property values change.
 * Compatible with Loxodon Framework's INotifyPropertyChanged pattern.
 */
export interface INotifyPropertyChanged {
    /**
     * Subscribe to property change notifications
     */
    onPropertyChanged(handler: PropertyChangedHandler): void;
    
    /**
     * Unsubscribe from property change notifications
     */
    offPropertyChanged(handler: PropertyChangedHandler): void;
}

/**
 * Handler for property change events
 */
export type PropertyChangedHandler = (propertyName: string, newValue: any, oldValue?: any) => void;

/**
 * Event arguments for property changed events
 */
export interface PropertyChangedEventArgs {
    propertyName: string;
    newValue: any;
    oldValue?: any;
}