import { UIKey } from './UIKey';

export interface UIRegistration {
    key: UIKey;
    prefabPath: string;                 // resources 下的相对路径 (不含扩展名)
    viewComponent?: new () => any;      // 可选：指定主组件类型，便于调试校验
    createViewModel?: () => any;        // 可选：创建 VM（如果你需要）
}

export class UIRegistry {
    private static _inst: UIRegistry;
    static get instance() {
        if (!this._inst) this._inst = new UIRegistry();
        return this._inst;
    }

    private map = new Map<string, UIRegistration>();

    register(reg: UIRegistration) {
        if (this.map.has(reg.key.name)) {
            console.warn('[UIRegistry] duplicate key:', reg.key.name);
        }
        this.map.set(reg.key.name, reg);
        return this;
    }

    get(key: UIKey) {
        return this.map.get(key.name);
    }
}