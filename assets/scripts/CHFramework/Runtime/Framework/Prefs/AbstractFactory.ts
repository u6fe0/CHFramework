/**
 * Abstract Factory
 */
import { IFactory } from "./IFactory";
export abstract class AbstractFactory<T> implements IFactory<T> {
    abstract create(): T;
}