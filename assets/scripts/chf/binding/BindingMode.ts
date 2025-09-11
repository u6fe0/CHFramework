/**
 * Binding modes for data binding
 */
export enum BindingMode {
    /**
     * One-way binding from source to target
     */
    OneWay = "OneWay",
    
    /**
     * Two-way binding between source and target
     */
    TwoWay = "TwoWay",
    
    /**
     * One-time binding (binds only once)
     */
    OneTime = "OneTime"
}

/**
 * Value converter interface for transforming values during binding
 */
export interface IValueConverter {
    /**
     * Convert value from source to target
     */
    convert(value: any, targetType?: any, parameter?: any): any;
    
    /**
     * Convert value from target back to source (for two-way binding)
     */
    convertBack?(value: any, targetType?: any, parameter?: any): any;
}