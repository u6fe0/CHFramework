import { Component } from 'cc';

/**
 * 精简版 UIView：仅负责延迟创建 ViewModel
 */
export abstract class UIView<TVM extends object = any> extends Component {
    readonly __isUIView = true;
    protected _vm?: TVM;
    private _initialized = false;

    protected createViewModel(): TVM | null | undefined {
        return null;
    }

    protected abstract onViewModelReady(vm: TVM): void;

    public init(vm?: TVM) {
        if (this._initialized) return;
        if (!vm) vm = this.createViewModel() || undefined;
        if (!vm) throw new Error('[UIView] 需要提供 ViewModel。');
        this._vm = vm;
        this.onViewModelReady(vm);
        this._initialized = true;
    }

    get viewModel(): TVM {
        if (!this._vm) throw new Error('[UIView] 尚未 init()。');
        return this._vm;
    }

    protected onLoad(): void {
        if (!this._initialized) {
            try { this.init(); } catch { /* 需要外部注入则忽略 */ }
        }
    }

    protected onDestroy(): void {
        this._vm = undefined;
    }
}