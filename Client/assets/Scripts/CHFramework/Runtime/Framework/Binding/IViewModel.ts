import { IPropertyChanged } from './IPropertyChanged';
/**
 * 视图模型接口
 */
export interface IViewModel extends IPropertyChanged {
    // 可选：统一生命周期
    dispose(): void;
}