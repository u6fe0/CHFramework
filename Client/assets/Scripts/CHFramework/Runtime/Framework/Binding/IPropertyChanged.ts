export interface IPropertyChanged {
    addPropertyChangedListener(listener: (property: string, value: any) => void): void;
    removePropertyChangedListener(listener: (property: string, value: any) => void): void;
}