import { IViewModel } from "../../../../Binding/IViewModel";
import { ModelBase } from "./ModelBase";

/**
 * 视图模型接口
 */
export class ViewModelBase<TModel extends ModelBase> implements IViewModel {
    /**
     * 与此视图模型关联的模型实例。
     * 子类可以直接通过 `this.model` 访问。
     */
    protected readonly model: TModel;
    /**
     * @param modelType 要自动实例化的模型类。
     * 例如: `super(MyModel)`
     */
    constructor() {
        const ctor = (this.constructor as any).__modelCtor;
        if (!ctor) {
            throw new Error('[ViewModelBase] 未绑定 Model 构造函数。请使用 @BindModel(...) 装饰器绑定。');
        }
        this.model = new ctor() as TModel;
    }
    // 可选：统一生命周期
    dispose(): void {
        // 释放资源
    }
    private _listeners: Array<(property: string, value: any) => void> = [];

    addPropertyChangedListener(listener: (property: string, value: any) => void): void {
        this._listeners.push(listener);
    }

    removePropertyChangedListener(listener: (property: string, value: any) => void): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    notifyPropertyChanged(property: string, value: any): void {
        this._listeners.forEach(listener => listener(property, value));
    }
}