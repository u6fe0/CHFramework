export type Observer<T> = (value: T) => void;

/**
 * 观察者模式实现
 */
export class Observable<T> {
    private _value: T;
    private observers: Observer<T>[] = [];

    constructor(value: T) {
        this._value = value;
    }

    get value(): T {
        return this._value;
    }

    set value(val: T) {
        if (val !== this._value) {
            this._value = val;
            this.notify();
        }
    }

    /**
     * 订阅观察者
     * @param observer 
     */
    subscribe(observer: Observer<T>): void {
        this.observers.push(observer);
    }
    /**
     * 取消订阅观察者
     * @param observer
     */
    unsubscribe(observer: Observer<T>): void {
        this.observers = this.observers.filter(o => o !== observer);
    }

    private notify(): void {
        this.observers.forEach(observer => observer(this._value));
    }
}