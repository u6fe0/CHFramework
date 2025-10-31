import { Context, GameUtil, ModelBase, Observable } from '../../../../Runtime/Framework';
import { GamePrefService } from '../../../Services/Preference/GamePref/GamePrefService';
/**
 * 设置界面数据模型
 */
export class SettingModel extends ModelBase {
    bgmVolume:Observable<number>; // 背景音乐音量
    isBgmOn: Observable<boolean>; // 背景音乐开关
    sfxVolume: Observable<number>; // 音效音量
    isSfxOn: Observable<boolean>; // 音效开关
    isVibrateOn: Observable<boolean>; // 振动开关
    // 引用持久化服务
    private gamePrefService: GamePrefService;

    constructor() {
        super();
        this.gamePrefService = Context.getService(GamePrefService);
        this.bgmVolume = new Observable(this.gamePrefService.gamePrefModel.bgmVolume);
        this.isBgmOn = new Observable(this.gamePrefService.gamePrefModel.isBgmOn);
        this.sfxVolume = new Observable(this.gamePrefService.gamePrefModel.sfxVolume);
        this.isSfxOn = new Observable(this.gamePrefService.gamePrefModel.isSfxOn);
        this.isVibrateOn = new Observable(this.gamePrefService.gamePrefModel.isVibrateOn);
    }

    /**
     * 设置背景音乐音量
     * @param volume 
     */
    setBgmVolume(volume: number) {
        const clampedValue = GameUtil.clamp(volume, 0, 1);
        this.gamePrefService.gamePrefModel.bgmVolume = Math.round(clampedValue * 100) / 100;
        this.gamePrefService.save();
    }
    /**
     * 设置背景音乐开关
     * @param enable 
     */
    setBgmEnable(enable: boolean) {
        this.gamePrefService.gamePrefModel.isBgmOn = enable;
        this.gamePrefService.save();
    }
    /**
     * 设置音效音量
     * @param volume 
     */
    setSfxVolume(volume: number) {
        const clampedValue = GameUtil.clamp(volume, 0, 1);
        this.gamePrefService.gamePrefModel.sfxVolume = Math.round(clampedValue * 100) / 100;
        this.gamePrefService.save();
    }
    /**
     * 设置音效开关
     * @param enable 
     */
    setSfxEnable(enable: boolean) {
        this.gamePrefService.gamePrefModel.isSfxOn = enable;
        this.gamePrefService.save();
    }
    /**
     * 设置振动开关
     * @param enable 
     */
    setVibrateEnable(enable: boolean) {
        this.gamePrefService.gamePrefModel.isVibrateOn = enable;
        this.gamePrefService.save();
    }
}