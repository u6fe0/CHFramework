import { _decorator, Label, Button, EditBox } from 'cc';
const { ccclass, property } = _decorator;

import { RenameViewModel } from './RenameViewModel';
import {
    Binder,
    LabelAdapter,
    EditBoxAdapter,
    ViewBase,
    ViewService,
    EventTrigger,
    Context,
    BindViewModel
} from '../../../../CHFramework/Framework';
import { ViewKeys } from '../../../Constant/ViewKeys';
import { GameEvent } from '../../../Constant/GameEvent';
import { AudioService } from '../../../Services/Audio/AudioService';
/**
 * Example: 玩家视图
 * 演示了如何使用 ViewModel 进行数据绑定和事件处理
 * 包括单向绑定、双向绑定、按钮点击事件等
 * 还展示了如何通过 Context 获取服务并关闭视图
 * 以及如何订阅和触发全局事件
 */
@ccclass('RenameView')
@BindViewModel(RenameViewModel)
export class RenameView extends ViewBase<RenameViewModel> {
    @property(Label)
    nickNameLb: Label = null!; // 显示昵称
    @property(Label)
    nextNickNameLb: Label = null!; // 即将改成的昵称
    @property(Label)
    renameCntLb: Label = null!; // 改名卡剩余数量
    @property(Button)
    renameBtn: Button = null!; // 改名按钮
    @property(Button)
    addBtn: Button = null!; // 改名卡增加按钮
    @property(Button)
    closeBtn: Button = null!; // 关闭按钮
    @property(EditBox)
    nameEditBox: EditBox = null!; // 输入昵称
    /**
     * 视图创建时调用
     */
    onCreate() {
        // 绑定 ViewModel 和 UI 组件：
        // 单向绑定 name 到 nameLabel
        Binder.bind(this.vm.nickName, new LabelAdapter(this.nickNameLb));
        // 单向绑定 nextNickName 到 nextNickNameLb
        Binder.bind(this.vm.nextNickName, new LabelAdapter(this.nextNickNameLb));
        // 单向绑定 renameCnt 到 renameCntLb
        Binder.bind(this.vm.renameCnt, new LabelAdapter(this.renameCntLb));
        // 双向绑定 name 到 nameEditBox，当 nameEditBox 内容变化时会更新到 vm.nextNickName
        Binder.bindTwoWay(this.vm.nextNickName, new EditBoxAdapter(this.nameEditBox));

        this.vm.renameCmd.onExecuteStateChanged(() => {
            if (this.isValid) {
                console.log('命令状态变化，更新按钮状态:', this.vm.renameCmd.canExecute());
                // 根据命令的可执行状态，更新按钮的 interactable 属性
                this.renameBtn.interactable = this.vm.renameCmd.canExecute();
            }
        });
        // 按钮点击事件：
        // 1.改名按钮点击
        this.renameBtn.node.on(Button.EventType.CLICK, async () => {
            const result = await this.vm.renameCmd.execute();
            console.log('改名结果:', result);
        }, this);
        // 2.增加改名卡按钮点击
        this.addBtn.node.on(Button.EventType.CLICK, () => {
            this.vm.addRenameCard();
        }, this);
        // 3.关闭按钮点击
        this.closeBtn.node.on(Button.EventType.CLICK, () => {
            Context.getService(ViewService).closeUI(ViewKeys.RenameView);
        }, this);

        // 事件示例：
        // 1.可选：可监听 ViewModel 属性变化
        this.vm.addPropertyChangedListener((propName: string, value: any) => {
            console.log(`Property ${propName} changed to ${value}`);
        });
        // 2.可选：可订阅全局事件
        EventTrigger.on(GameEvent.ReNameSuccess, this.onReNameSuccess, this);

        // 打印传递的参数
        console.log('RenameView created with param:', this.param);
    }

    protected onEnable(): void {
        const audioService = Context.getService(AudioService);
        audioService.playBgm("bg2");
    }

    protected onDisable(): void {
        const audioService = Context.getService(AudioService);
        audioService.playBgm("bg1");
    }

    /**
     * 改名事件监听
     * @param param 
     */
    private onReNameSuccess(param: any) {
        console.log('收到改名成功事件，新的昵称是:', param.newName);
    }
}