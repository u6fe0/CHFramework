import { _decorator, Button, Label, RichText } from 'cc';
import { DialogModel } from './DialogModel';
import { Context, ViewBase, ViewService, BindViewModel } from '../../../../Runtime/Framework';
import { DialogViewModel } from './DialogViewModel';
import { ViewKeys } from '../../../Constant/ViewKeys';
const { ccclass, property } = _decorator;

@ccclass('DialogView')
@BindViewModel(DialogViewModel) // 绑定 VM 构造器
export class DialogView extends ViewBase<DialogViewModel> {
    @property(Label)
    titleLb: Label = null!; // 标题
    @property(RichText)
    contentLb: RichText = null!; // 内容
    @property(Button)
    sureBtn: Button = null!; // 确定按钮
    @property(Button)
    cancelBtn: Button = null!; // 取消按钮
    onCreate(): void {
        const model = this.param as DialogModel;
        this.titleLb.string = model.title || '标题';
        this.contentLb.string = model.content || '内容';

        // 如果没有传取消回调，则隐藏取消按钮
        if (!model.cancel) {
            this.cancelBtn.node.active = false;
        }

        this.sureBtn.node.on(Button.EventType.CLICK, () => {
            model.confirm && model.confirm();
            Context.getService(ViewService).closeUI(ViewKeys.DialogView);
        }, this);
        this.cancelBtn.node.on(Button.EventType.CLICK, () => {
            model.cancel && model.cancel();
            Context.getService(ViewService).closeUI(ViewKeys.DialogView);
        }, this);
    }
}


