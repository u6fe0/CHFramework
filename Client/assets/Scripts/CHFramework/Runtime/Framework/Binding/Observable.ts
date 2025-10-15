export type Observer<T> = (value: T) => void;

/**
 * 观察者模式实现
 */
export class Observable<T> {
    private _value: T;
    private _observers: Observer<T>[] = [];

    constructor(value: T) {
        this._value = value;
    }

    get value(): T { return this._value; }
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
    on(observer: Observer<T>): void {
        this._observers.push(observer);
    }
    /**
     * 取消订阅观察者
     * @param observer
     */
    off(observer: Observer<T>): void {
        this._observers = this._observers.filter(o => o !== observer);
    }
    /**
     * 通知所有观察者
     */
    private notify(): void {
        this._observers.forEach(observer => observer(this._value));
    }
}