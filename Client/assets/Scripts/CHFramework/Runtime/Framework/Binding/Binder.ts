import { IUIAdapter } from './IUIAdapter';
import { Observable } from './Observable';

export class Binder {
    static bind<T>(observable: Observable<T>, adapter: IUIAdapter<T>): void {
        const cur = observable.value as T;
        if (adapter.getValue() !== cur) adapter.setValue(cur);
        observable.on(value => adapter.setValue(value));
    }

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