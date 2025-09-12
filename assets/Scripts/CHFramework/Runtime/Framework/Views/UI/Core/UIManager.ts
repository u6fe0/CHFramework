import { resources, Prefab, instantiate, Node } from 'cc';
import { UIKey } from './UIKey';
import { UIRegistry } from './UIRegistry';
import { UILayers, LayerEnum } from './UILayers';
import { UIView } from './UIView';

interface ActiveView {
    key: UIKey;
    node: Node;
    layer: LayerEnum;
    vm?: any;
}

export class UIManager {
    private static _inst: UIManager;
    static get instance() {
        if (!this._inst) this._inst = new UIManager();
        return this._inst;
    }

    private actives: ActiveView[] = [];

    async open(
        key: UIKey,
        options: { layer?: LayerEnum } = {}
    ): Promise<Node> {
        const reg = UIRegistry.instance.get(key);
        if (!reg) throw new Error(`[UIManager] UIKey not registered: ${key}`);

        const prefab: Prefab = await new Promise((resolve, reject) => {
            resources.load(reg.prefabPath, Prefab, (err, asset) => {
                if (err || !asset) return reject(err);
                resolve(asset);
            });
        });

        const node = instantiate(prefab);
        const layer = options.layer || LayerEnum.Normal;
        UILayers.instance.getLayerNode(layer).addChild(node);

        let vm: any;
        if (reg.createViewModel) {
            vm = reg.createViewModel();
        }

        // 1) 优先：如果有 UIView 子类
        if (reg.viewComponent) {
            const comp = node.getComponent(reg.viewComponent as any);
            if (comp) {
                if ((comp as any).__isUIView && typeof (comp as UIView).init === 'function') {
                    (comp as UIView).init(vm); // UIView 负责自建或使用传入 VM
                } else if (vm && typeof (comp as any).setupBindings === 'function') {
                    // 2) 兼容旧方案 setupBindings(vm)
                    (comp as any).setupBindings(vm);
                }
            } else {
                console.warn(
                    `[UIManager] viewComponent ${reg.viewComponent.name} not found on prefab ${reg.prefabPath}`
                );
            }
        }

        this.actives.push({ key, node, layer, vm });
        return node;
    }

    async close(key: UIKey) {
        for (let i = this.actives.length - 1; i >= 0; i--) {
            const a = this.actives[i];
            if (a.key === key) {
                a.node.removeFromParent();
                a.node.destroy();
                this.actives.splice(i, 1);
                return;
            }
        }
    }

    async closeAll(layer?: LayerEnum) {
        for (let i = this.actives.length - 1; i >= 0; i--) {
            const a = this.actives[i];
            if (!layer || a.layer === layer) {
                a.node.removeFromParent();
                a.node.destroy();
                this.actives.splice(i, 1);
            }
        }
    }

    getOpenCount(key?: UIKey) {
        if (!key) return this.actives.length;
        return this.actives.filter(a => a.key === key).length;
    }
}