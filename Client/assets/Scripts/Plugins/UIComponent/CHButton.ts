import { _decorator, Button } from 'cc';
import { Context } from '../../CHFramework/Framework';
import { AudioService } from '../../Demo_CHFramework/Services/Audio/AudioService';
const { ccclass, property, menu } = _decorator;
import { Enum } from "cc";
/**
 * 带点击音效的按钮组件
 * 继承自cc.Button
 */
const ClickAudioType = Enum({
    Normal: "click", // 普通点击音效
});
@ccclass('CHButton')
@menu('CHFramework/UI/CHButton')
export class CHButton extends Button {
    @property({ type: ClickAudioType })
    clickAudioType = ClickAudioType.Normal;

    protected onLoad(): void {
        this.node.on(Button.EventType.CLICK, this.onButtonClick, this);
    }
    public onDestroy(): void {
        this.node.off(Button.EventType.CLICK, this.onButtonClick, this);
    }
    private onButtonClick(): void {
        const audioService = Context.getService(AudioService);
        audioService.playOneShot(this.clickAudioType);
    }
}


