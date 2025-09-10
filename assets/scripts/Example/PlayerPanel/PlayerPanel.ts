import { _decorator, Component, Label, Button } from 'cc';
import { PlayerViewModel } from './PlayerViewModel';
import { Binder } from '../../CHFramework/Framework';
const { ccclass, property } = _decorator;
import { EditBox } from 'cc';

@ccclass('PlayerPanel')
export class PlayerPanel extends Component {
    @property(Label)
    nameLabel: Label = null!;

    @property(Label)
    hpLabel: Label = null!;

    @property(Button)
    damageBtn: Button = null!;

    @property(EditBox)
    nameEditBox: EditBox = null!;

    private vm: PlayerViewModel;

    onLoad() {
        // 初始化 ViewModel
        const playerModel = { id: 1, name: "Hero", hp: 100 };
        this.vm = new PlayerViewModel(playerModel);
        this.vm.addPropertyChangedListener((propName: string, value: any) => {
            console.log(`Property ${propName} changed to ${value}`);
        });

        // 单向绑定 name 到 nameLabel
        Binder.bind(this.vm.name, this.nameLabel);

        // 单向绑定 hp 到 hpLabel
        Binder.bind(this.vm.hp, this.hpLabel);

        // 双向绑定 name 到 nameEditBox
        Binder.bindTwoWay(this.vm.name, this.nameEditBox);

        // 按钮事件绑定到 Command
        this.damageBtn.node.on(Button.EventType.CLICK, () => {
            this.vm.damageCommand.execute();
        }, this);
    }
}