export interface IServiceRegistry {
    register<T>(service: T): void;
    unregister<T>(service: T): void;
}
