/**
 * 绑定 Model 装饰器
 * @param ctor Model 构造函数
 */
export function BindModel(ctor: new () => any) {
    return function (target: any) {
        target.__modelCtor = ctor;
    }
}