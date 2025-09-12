import { Component, Enum, _decorator } from 'cc';
import { ViewModel } from '../../../Binding/IViewModel';
import { LayerEnum } from './UILayers';
const { property } = _decorator;
/**
 * UI 视图基类
 */
export abstract class UIView extends Component {
    @property({ type: Enum(LayerEnum) })
    layer: LayerEnum = LayerEnum.Normal;
    protected _vm: ViewModel;

    protected abstract initViewModel(): ViewModel;
    protected onViewModelReady(vm: ViewModel): void {
        this._vm = vm;
    }

    get viewModel(): ViewModel {
        if (!this._vm) throw new Error('[UIView] 尚未 init()。');
        return this._vm;
    }
    /**
     * 初始化视图和 ViewModel
     */
    init() {
        const vm = this.initViewModel();
        this._vm = vm;
        this.onViewModelReady(vm);
    }
    /**
     * 销毁时，释放 ViewModel
     */
    protected onDestroy(): void {
        if (this._vm && typeof this._vm.dispose === 'function') {
            this._vm.dispose();
        }
        this._vm = undefined;
    }
}