import { _decorator, Component } from 'cc';
import { Context, ViewService, HttpService, JsonReader, TableReaderService } from '../CHFramework/Framework';
import { ViewKeys } from './Constant/ViewKeys';
import { ToastService } from './UI/Toast/ToastService';
import { RichToast } from './UI/Toast/RichToast';
import { CustomViewLoadingUI } from './UI/UILoading/CustomViewLoadingUI';
import { PlayerPrefService } from './Services/Preference/PlayerPref/PlayerPrefService';
import { AudioService } from './Services/Audio/AudioService';
import { GamePrefService } from './Services/Preference/GamePref/GamePrefService';
const { ccclass } = _decorator;
/**
 * 启动入口脚本
 * 负责初始化游戏运行所需的各种核心服务
 * 资源系统、UI系统、多语言、本地存储、补丁更新等
 * 挂在场景中的一个 Node 上，保证游戏启动时所有基础设施都已准备好
 */
@ccclass('Launcher')
export class Launcher extends Component {
    public static instance: Launcher = null;
    onLoad() {
        Launcher.instance = this;

        this.initServices();
        this.openMainUI();
    }
    /**
     * 初始化逻辑服务
     */
    initServices() {
        const container = Context.getContainer();
        // 注册服务
        container.register(new ViewService({ ViewLoadingUIClass: CustomViewLoadingUI }));
        container.register(new HttpService());
        container.register(new ToastService(RichToast));
        container.register(new TableReaderService({
            TableReaderClass: JsonReader,
            bundleName: "resources",
            pathPrefix: "Demo_CHFramework/Table"
        }));
        container.register(new PlayerPrefService());
        container.register(new GamePrefService());
        container.register(new AudioService({
            bundleName: "resources",
            pathPrefix: "Demo_CHFramework/Audio"
        }));

    }
    /**
     * 打开主界面
     */
    openMainUI() {
        Context.getService(ViewService).openUI(ViewKeys.MainView);
    }
}
