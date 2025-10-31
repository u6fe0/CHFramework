export interface IServiceLocator {
    resolve<T>(serviceType: new (...args: any[]) => T): T | null;
}