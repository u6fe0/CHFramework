import { _decorator, Slider, Toggle, UITransform } from 'cc';
import { SettingViewModel } from './SettingViewModel';
const { ccclass, property } = _decorator;
import { Binder, ViewBase, BindViewModel, SliderAdapter, ToggleAdapter } from '../../../../Runtime/Framework';

/**
 * Example: 设置视图
 * 演示了如何使用 ViewModel 进行数据绑定
 */
const sliderMaxWidth = 295; // 滑动条的最大宽度

@ccclass('SettingView')
@BindViewModel(SettingViewModel)
export class SettingView extends ViewBase<SettingViewModel> {
    @property(Toggle)
    bgmToggle: Toggle = null!; // 背景音乐开关
    @property(Slider)
    bgmSlider: Slider = null!; // 背景音乐滑动条
    @property(UITransform)
    bgmUITransform: UITransform = null!; // UI 变换组件
    @property(Toggle)
    sfxToggle: Toggle = null!; // 音效开关
    @property(Slider)
    sfxSlider: Slider = null!; // 音效滑动条
    @property(Toggle)
    vibrateToggle: Toggle = null!; // 振动开关
    @property(UITransform)
    sfxUITransform: UITransform = null!; // UI 变换组件
    /**
     * 视图创建时调用
     */
    onCreate(): void {
        // 绑定 ViewModel 和 UI 组件
        Binder.bindTwoWay(this.vm.isBgmOn, new ToggleAdapter(this.bgmToggle));
        Binder.bindTwoWay(this.vm.bgmVolume, new SliderAdapter(this.bgmSlider));
        Binder.bindTwoWay(this.vm.isSfxOn, new ToggleAdapter(this.sfxToggle));
        Binder.bindTwoWay(this.vm.sfxVolume, new SliderAdapter(this.sfxSlider));
        Binder.bindTwoWay(this.vm.isVibrateOn, new ToggleAdapter(this.vibrateToggle));

        // 初始化滑动条宽度
        this.bgmUITransform.width = this.bgmSlider.progress * sliderMaxWidth;
        this.sfxUITransform.width = this.sfxSlider.progress * sliderMaxWidth;
        // 监听滑动条变化
        this.bgmSlider.node.on('slide', this.onBgmSliderChange, this);
        this.sfxSlider.node.on('slide', this.onSfxSliderChange, this);
    }
    /**
     * 背景音乐滑动条
     * @param slider 
     */
    onBgmSliderChange(slider: Slider) {
        this.bgmUITransform.width = slider.progress * sliderMaxWidth;
    }
    /**
     * 音效滑动条
     * @param slider 
     */
    onSfxSliderChange(slider: Slider) {
        this.sfxUITransform.width = slider.progress * sliderMaxWidth;
    }
}
