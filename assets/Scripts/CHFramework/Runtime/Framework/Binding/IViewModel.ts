import { IPropertyChanged } from './IPropertyChanged';

export interface IViewModel extends IPropertyChanged {
    // 可选：统一生命周期
    dispose(): void;
}
/**
 * 视图模型接口
 */
export class ViewModel implements IViewModel {
    // 可选：统一生命周期
    dispose(): void {
        // 释放资源
    }
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