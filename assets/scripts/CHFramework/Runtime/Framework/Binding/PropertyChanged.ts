export interface IPropertyChanged {
    addPropertyChangedListener(listener: (property: string, value: any) => void): void;
    removePropertyChangedListener(listener: (property: string, value: any) => void): void;
}

export class PropertyChanged implements IPropertyChanged {
    private listeners: Array<(property: string, value: any) => void> = [];

    addPropertyChangedListener(listener: (property: string, value: any) => void): void {
        this.listeners.push(listener);
    }

    removePropertyChangedListener(listener: (property: string, value: any) => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyPropertyChanged(property: string, value: any): void {
        this.listeners.forEach(listener => listener(property, value));
    }
}