import { IServiceLocator } from "./IServiceLocator";
import { IServiceRegistry } from "./IServiceRegistry";

export interface IServiceContainer extends IServiceLocator, IServiceRegistry {
}