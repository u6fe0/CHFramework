import { BindModel, Context, ViewModelBase } from '../../../../CHFramework/Framework';
import { AudioService } from '../../../Services/Audio/AudioService';
import { SettingModel } from './SettingModel';

@BindModel(SettingModel)
export class SettingViewModel extends ViewModelBase<SettingModel> {
    get isBgmOn() { return this.model.isBgmOn; } // 背景音乐开关
    get bgmVolume() { return this.model.bgmVolume; } // 背景音乐音量
    get isSfxOn() { return this.model.isSfxOn; } // 音效开关
    get sfxVolume() { return this.model.sfxVolume; } // 音效音量
    get isVibrateOn() { return this.model.isVibrateOn; } // 振动开关
    private audioService: AudioService;

    constructor() {
        super();
        this.audioService = Context.getService(AudioService);
        this.isBgmOn.on(this.onBgmStateChanged.bind(this));
        this.bgmVolume.on(this.onBgmSliderChanged.bind(this));
        this.isSfxOn.on(this.onSfxStateChanged.bind(this));
        this.sfxVolume.on(this.onSfxSliderChanged.bind(this));
        this.isVibrateOn.on(this.onVibrateStateChanged.bind(this));
    }
    /**
     * 处理背景音乐开关状态变化
     * @param value 
     */
    onBgmStateChanged(value: boolean) {
        this.model.setBgmEnable(value);
        if (value === true) {
            this.audioService.resumeBgm();
        } else {
            this.audioService.stopBgm();
        }
    }
    /**
     * 处理背景音乐音量滑动条变化
     * @param value 
     */
    onBgmSliderChanged(value: number) {
        this.model.setBgmVolume(value);
        this.audioService.setBgmVolume(value);
    }
    /**
     * 处理音效开关状态变化
     * @param value 
     */
    onSfxStateChanged(value: boolean) {
        this.model.setSfxEnable(value);
        this.audioService.setSfxEnable(value);
    }
    /**
     * 处理音效音量滑动条变化
     * @param value 
     */
    onSfxSliderChanged(value: number) {
        this.model.setSfxVolume(value);
        this.audioService.setSfxVolume(value);
    }
    /**
     * 处理振动开关状态变化
     * @param value 
     */
    onVibrateStateChanged(value: boolean) {
        this.model.setVibrateEnable(value);
    }
}


