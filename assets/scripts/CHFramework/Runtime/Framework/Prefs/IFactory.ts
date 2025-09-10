/**
 * Interface for a factory that creates instances of a specified type.
 */
export interface IFactory<T> {
    create(): T;
}

