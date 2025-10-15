import { IPropertyChanged } from './IPropertyChanged';

export interface IViewModel extends IPropertyChanged {
    // 可选：统一生命周期
    dispose(): void;
}