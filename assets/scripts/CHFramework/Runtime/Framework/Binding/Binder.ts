import { IUIAdapter } from './IUIAdapter';
import { Observable } from './Observable';

export class Binder {
    static bind<T>(observable: Observable<T>, adapter: IUIAdapter<T>): void {
        observable.subscribe(value => adapter.setValue(value));
    }

    static bindTwoWay(observable: Observable<string>, adapter: IUIAdapter<string>): void {
        observable.subscribe(value => {
            if (adapter.getValue() !== value) adapter.setValue(value);
        });
        adapter.onChange(value => {
            if (observable.value !== value) observable.value = value;
        });
    }
}