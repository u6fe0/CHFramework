import { Context } from "../../../Runtime/Framework";
import { GamePrefService } from "../Preference/GamePref/GamePrefService";
/**
 * 设备服务
 */
export class DeviceService {
    /**
     * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
     * @returns 
     */
    vibrateShort(): void {
        const gamePref = Context.getService(GamePrefService).gamePrefModel;
        if (!gamePref.isVibrateOn) return;
        if (window.wx && window.wx.vibrateShort) {
            window.wx.vibrateShort();
        }
    }
    /**
     * 使手机发生较长时间的振动（400 ms)
     * @returns 
     */
    vibrateLong(): void {
        const gamePref = Context.getService(GamePrefService).gamePrefModel;
        if (!gamePref.isVibrateOn) return;
        if (window.wx && window.wx.vibrateLong) {
            window.wx.vibrateLong();
        }
    }
}