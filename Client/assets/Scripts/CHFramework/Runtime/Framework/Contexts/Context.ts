import { IServiceContainer } from "../Services/Base/IServiceContainer";
import { ServiceContainer } from "../Services/ServiceContainer";
/**
 * Context 类
 */
export class Context {
    // Context 内容
    private static container: IServiceContainer  = new ServiceContainer();
    public static getContainer(): IServiceContainer {
        return this.container;
    }
    /**
     * 获取服务
     * @param serviceType
     * @returns
     */
    public static getService<T>(serviceType: new (...args: any[]) => T): T | null {
        return Context.container.resolve<T>(serviceType);
    }
}