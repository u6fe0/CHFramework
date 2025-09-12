import { _decorator, Label, Button, EditBox } from 'cc';
import { PlayerViewModel } from './PlayerViewModel';
import { Binder, LabelAdapter, EditBoxAdapter, UIView, UIManager } from '../../CHFramework/Framework';
import { ViewKeys } from '../../Game/Constant/ViewKeys';
const { ccclass, property } = _decorator;
/**
 * 玩家视图
 */
@ccclass('PlayerView')
export class PlayerView extends UIView {
    @property(Label)
    nameLabel: Label = null!;
    @property(Label)
    hpLabel: Label = null!;
    @property(Button)
    damageBtn: Button = null!;
    @property(Button)
    closeBtn: Button = null!;
    @property(EditBox)
    nameEditBox: EditBox = null!;
    private vm: PlayerViewModel;

    protected initViewModel(): PlayerViewModel {
        // 默认创建一个空的 ViewModel，实际应用中可以根据需要传入初始数据
        return new PlayerViewModel({ id: 0, name: "Player", hp: 100 });
    }

    protected onViewModelReady(vm: PlayerViewModel): void {
        this.vm = vm;
    }

    init() {
        super.init();
        // 监听 ViewModel 属性变化（可选）
        this.vm.addPropertyChangedListener((propName: string, value: any) => {
            console.log(`Property ${propName} changed to ${value}`);
        });
        // 单向绑定 name 到 nameLabel
        Binder.bind(this.vm.name, new LabelAdapter(this.nameLabel));
        // 单向绑定 hp 到 hpLabel
        Binder.bind(this.vm.hp, new LabelAdapter(this.hpLabel));
        // 双向绑定 name 到 nameEditBox
        Binder.bindTwoWay(this.vm.name, new EditBoxAdapter(this.nameEditBox));
        // 按钮事件绑定到 Command
        this.damageBtn.node.on(Button.EventType.CLICK, () => {
            this.vm.damageCommand.execute();
        }, this);

        this.closeBtn.node.on(Button.EventType.CLICK, () => {
            UIManager.instance.close(ViewKeys.Player);
        }, this);
    }
}