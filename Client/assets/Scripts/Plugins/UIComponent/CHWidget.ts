import { _decorator, sys, view, Widget } from 'cc';
const { ccclass, property, menu } = _decorator;
/**
 * author: CHFramework
 * 安全区域适配组件
 * 用于适配不同设备的安全区域，避免UI被刘海、胶囊遮挡
 */
@ccclass('CHWidget')
@menu('CHFramework/UI/CHWidget')
export class CHWidget extends Widget {
    @property({
        displayName: "顶部安全区域适配",
        tooltip: "若勾选上，顶部调整至安全适配距离",
        visible() {
            return !this.isTopMenuButtonAdapter;
        },

    })
    get isTopSafeAreaAdapter() {
        return this._isTopSafeAreaAdapter;
    }
    set isTopSafeAreaAdapter(value) {
        this._isTopSafeAreaAdapter = value;
        this.isAlignTop = value;
    }
    @property({ serializable: true })
    private _isTopSafeAreaAdapter = false;
    @property({
        displayName: "顶部胶囊区域适配",
        tooltip: "若勾选上，顶部调整至安全适配距离",
        visible() {
            return !this.isTopSafeAreaAdapter;
        }
    })
    get isTopMenuButtonAdapter() {
        return this._isTopMenuButtonAdapter;
    }
    set isTopMenuButtonAdapter(value) {
        this._isTopMenuButtonAdapter = value;
        this.isAlignTop = value;
    }
    @property({ serializable: true })
    private _isTopMenuButtonAdapter = false;
    @property({
        displayName: "底部安全区域适配",
        tooltip: "若勾选上，底部调整至安全适配距离",
    })
    get isBottomSafeAreaAdapter() {
        return this._isBottomSafeAreaAdapter;
    }
    set isBottomSafeAreaAdapter(value) {
        this._isBottomSafeAreaAdapter = value;
        this.isAlignBottom = value;
    }
    @property({ serializable: true })
    private _isBottomSafeAreaAdapter = false;

    // 系统信息缓存
    private static _systemInfo: any = null;
    get systemInfo() {
        if (!CHWidget._systemInfo) {
            if (sys.platform === sys.Platform.WECHAT_GAME) {
                CHWidget._systemInfo = window.wx.getSystemInfoSync();
            } else if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
                CHWidget._systemInfo = window.tt.getSystemInfoSync();
            } else {
                // 保底-其他平台
                if (window.wx && window.wx.getSystemInfoSync) {
                    CHWidget._systemInfo = window.wx.getSystemInfoSync();
                }
            }
        }
        return CHWidget._systemInfo;
    }

    protected start(): void {
        if ((sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME)) {
            if (this.isTopSafeAreaAdapter || this.isTopMenuButtonAdapter) {
                const safeTop = this.getSafeAreaTop();
                this.top += safeTop;
            }
            if (this.isBottomSafeAreaAdapter) {
                const safeBottom = this.getSafeAreaBottom();
                this.bottom += safeBottom;
            }
            if (this.isTopSafeAreaAdapter || this.isBottomSafeAreaAdapter) {
                this.updateAlignment();
            }
        }
    }
    /**
     * 获取底部安全适配高度
     * @returns 底部安全适配高度
     */
    private getSafeAreaBottom() {
        if (this.systemInfo && this.systemInfo.safeArea) {
            const windowHeight = this.systemInfo.windowHeight;
            const gameHeight = view.getVisibleSize().height;
            const ratio = gameHeight / windowHeight;
            const offsetY = windowHeight - this.systemInfo.safeArea.bottom;
            return offsetY * ratio;
        }
        return 0;
    }
    /**
     * 获取顶部安全适配高度
     * @returns 顶部安全适配高度
     */
    private getSafeAreaTop() {
        if (this.systemInfo && this.systemInfo.safeArea) {
            const windowHeight = this.systemInfo.windowHeight;
            const gameHeight = view.getVisibleSize().height;
            const ratio = gameHeight / windowHeight;
            if (this.isTopSafeAreaAdapter) {
                return this.systemInfo.safeArea.top * ratio;
            }
            if (this.isTopMenuButtonAdapter) {
                const rect = window.wx.getMenuButtonBoundingClientRect();
                return ratio * rect.bottom;
            }
        }
        return 0;
    }
}


