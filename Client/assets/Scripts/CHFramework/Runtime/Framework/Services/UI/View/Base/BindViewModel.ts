import { ModelBase } from './ModelBase';
import { ViewModelBase } from './ViewModelBase';

export function BindViewModel<TModel extends ModelBase, TVM extends ViewModelBase<TModel> = ViewModelBase<TModel>>(vmCtor: new () => TVM) {
  return function <C extends { new(...args: any[]): {} }>(target: C) {
    (target as any).__vmCtor = vmCtor;
  };
}