import { _decorator, Button, Enum } from 'cc';
import { Context } from '../../Runtime/Framework';
import { AudioService } from '../../Demo/Services/Audio/AudioService';
import { DeviceService } from '../../Demo/Services/Device/DeviceService';
const { ccclass, property, menu } = _decorator;
/**
 * author: CHFramework
 * 带点击音效的按钮组件
 * 继承自cc.Button
 */
const ClickAudioType = Enum({
    Normal: "click", // 普通点击音效
});
// 振动类型
const ClickVibrateType = Enum({
    None: "None", // 不振动
    Short: "Short", // 短振动
    Long: "Long", // 长振动
});
@ccclass('CHButton')
@menu('CHFramework/UI/CHButton')
export class CHButton extends Button {
    @property({
        type: ClickAudioType,
        tooltip: "点击按钮时的音效类型",
        displayName: "音效类型"
    })
    audioType = ClickAudioType.Normal;

    @property({
        type: ClickVibrateType,
        tooltip: "点击按钮时的振动类型",
        displayName: "振动类型"
    })
    vibrateType = ClickVibrateType.None;

    protected onLoad(): void {
        this.node.on(Button.EventType.CLICK, this.onButtonClick, this);
    }
    public onDestroy(): void {
        this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
    }
    /**
     * 按钮点击回调
     */
    private onButtonClick(): void {
        const audioService = Context.getService(AudioService);
        audioService.playOneShot(this.audioType);
        const deviceService = Context.getService(DeviceService);
        switch (this.vibrateType) {
            case ClickVibrateType.Short:
                deviceService.vibrateShort();
                break;
            case ClickVibrateType.Long:
                deviceService.vibrateLong();
                break;
            case ClickVibrateType.None:
                break;
        }
    }
}


