import { IServiceContainer } from "./Base/IServiceContainer"
export class ServiceContainer implements IServiceContainer {
    private _services: Set<any> = new Set<any>();
    /**
     * 解析服务
     * @param serviceType 服务类型
     * @returns 服务实例，未找到返回 null
     */
    public resolve<T>(serviceType: new (...args: any[]) => T): T | null {
        for (const service of this._services) {
            if (service instanceof serviceType) {
                return service;
            }
        }
        return null;
    }
    /**
     * 注册服务
     * @param service 服务实例
     */
    public register<T>(service: T): void {
        this._services.add(service);
    }
    /**
     * 注销服务
     * @param service 服务实例
     */
    public unregister<T>(service: T): void {
        this._services.delete(service);
    }


    public dispose(): void {
        this._services.clear();
    }
}