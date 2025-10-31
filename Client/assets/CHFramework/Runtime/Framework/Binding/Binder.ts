import { IUIAdapter } from './IUIAdapter';
import { Observable } from './Observable';
/**
 * 绑定器
 */
export class Binder {
    /**
     * 单向绑定
     * @param observable 
     * @param adapter 
     */
    static bind<T>(observable: Observable<T>, adapter: IUIAdapter<T>): void {
        const cur = observable.value as T;
        if (adapter.getValue() !== cur) adapter.setValue(cur);
        observable.on(value => adapter.setValue(value));
    }
    /**
     * 双向绑定
     * @param observable 
     * @param adapter 
     */
    static bindTwoWay<T>(observable: Observable<T>, adapter: IUIAdapter<T>): void {
        const cur = observable.value;
        if (adapter.getValue() !== cur) adapter.setValue(cur);
        observable.on(value => {
            if (adapter.getValue() !== value) adapter.setValue(value);
        });
        adapter.onChange(value => {
            if (observable.value !== value) observable.value = value;
        });
    }
}