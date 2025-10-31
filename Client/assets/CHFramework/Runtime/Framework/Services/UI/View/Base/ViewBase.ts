import { Component, _decorator } from 'cc';
import { ViewState, ViewType } from './UILayers';
import { ViewModelBase } from './ViewModelBase';
import { IAnimation } from '../../Animations/Base/AnimationBase';
import { ModelBase } from './ModelBase';
const { ccclass, property } = _decorator;
/**
 * View 视图基类
 */
@ccclass('ViewBase')
export abstract class ViewBase<TVM extends ViewModelBase<ModelBase> = ViewModelBase<ModelBase>> extends Component {
    @property({ type: ViewType })
    type = ViewType.FULL;
    @property({
        visible() {
            return this.type == ViewType.POPUP || this.type == ViewType.DIALOG;
        },
        tooltip: "勾选时，点击遮罩可关闭界面",
    })
    private _isMaskClickable = false;
    public get IsMaskClickable() {
        return this._isMaskClickable;
    }
    protected vm!: TVM;
    // 打开View时传递的参数
    public param = {};
    // View 状态
    public state: ViewState = ViewState.NONE;
    // 进入动画
    private _enterAnimation: IAnimation;
    public get EnterAnimation() {
        return this._enterAnimation;
    }
    public set EnterAnimation(animation: IAnimation) {
        this._enterAnimation = animation;
    }
    // 退出动画
    private _exitAnimation: IAnimation;
    public get ExitAnimation() {
        return this._exitAnimation;
    }
    public set ExitAnimation(animation: IAnimation) {
        this._exitAnimation = animation;
    }
    /**
     * 创建 ViewModel 实例
     * returns ViewModel 实例
     */
    protected createViewModel(): TVM {
        const ctor = (this.constructor as any).__vmCtor // 装饰器注入
        if (!ctor) {
            throw new Error('[ViewBase] 未绑定 ViewModel 构造函数。请使用 @BindViewModel(...) 装饰器绑定。');
        }
        return new (ctor as new () => TVM)();
    }
    /**
     * 获取 ViewModel 实例
     * @returns ViewModel 实例
     */
    get viewModel(): TVM {
        if (!this.vm) throw new Error('[ViewBase] 尚未 init()。');
        return this.vm;
    }
    /**
     * 创建视图
     */
    public create() {
        this.state = ViewState.CREATE_BEGIN;
        this.vm = this.createViewModel();
        if (!this.vm) throw new Error('[ViewBase] initVM() 返回值不能为空。');
        this.onCreate();
        this.state = ViewState.CREATE_END;
    }
    /**
     * Called by ViewService when the view is opened.
     */
    abstract onCreate(): void;
    /**
     * Called by ViewService when the view is shown.
     */
    public show() {
        this.doShow();
    }
    /**
     * 执行显示
     */
    doShow() {
        this.state = ViewState.VISIBLE;
        this.onShow();
        if (this.EnterAnimation) {
            this.EnterAnimation.onStart(() => {
                this.state = ViewState.ENTER_ANIMATION_ING;
            });
            this.EnterAnimation.onEnd(() => {
                this.state = ViewState.READY;
            });
            this.EnterAnimation.play()
        } else {
            this.state = ViewState.READY;
        }
    }
    /**
     * 显示时的回调
     */
    protected onShow() { }

    public hide() {
        this.doHide();
    }
    /**
     * 隐藏
     */
    doHide() {
        if (this.ExitAnimation) {
            this.ExitAnimation.onStart(() => {
                this.state = ViewState.EXIT_ANIMATION_ING;
            });
            this.ExitAnimation.onEnd(() => {
                this.state = ViewState.INVISIBLE;
                this.onHide();
                this.doDismiss();
            });
            this.ExitAnimation.play()
        } else {
            this.state = ViewState.INVISIBLE;
            this.onHide();
            this.doDismiss();
        }
    }
    /**
     * 隐藏时的回调
     */
    protected onHide() { }
    /**
     * 执行销毁
     */
    doDismiss() {
        this.state = ViewState.DISMISS_BEGIN;
        this.onDismiss();
        this.state = ViewState.DISMISS_END;
    }
    /**
     * 销毁时的回调
     */
    onDismiss() {
        this.node.destroy();
    }
    /**
     * 销毁时，释放 ViewModel
     */
    protected onDestroy(): void {
        if (this.vm && typeof this.vm.dispose === 'function') {
            this.vm.dispose();
        }
        this.vm = undefined;
    }
}