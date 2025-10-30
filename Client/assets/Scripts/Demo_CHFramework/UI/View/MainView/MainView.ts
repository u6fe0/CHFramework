import { _decorator, Button, Label } from 'cc';
const { ccclass, property } = _decorator;
import {
    ViewBase,
    ViewService,
    Context,
    GameUtil,
    HttpService,
    HttpMethod,
    IHttpRequestConfig,
    IHttpResponse,
    BindViewModel,
    TableReaderService,
} from '../../../../CHFramework/Framework';
import { MainViewModel } from './MainViewModel';
import { ViewKeys } from '../../../Constant/ViewKeys';
import { ToastService } from '../../Toast/ToastService';
import { AudioService } from '../../../Services/Audio/AudioService';
import { IItem, IHero } from '../../../TableModel/TableModel';
/**
 * Example: 主界面视图
 */
@ccclass('MainView')
@BindViewModel(MainViewModel)
export class MainView extends ViewBase<MainViewModel> {
    @property(Button)
    openRenameUIBtn: Button = null!; // 改名按钮
    @property(Button)
    tipBtn: Button = null!; // 提示按钮
    @property(Button)
    httpRequestBtn: Button = null!; // HTTP请求按钮
    @property(Button)
    openSettingUIBtn: Button = null!; // 设置按钮
    @property(Button)
    openShopUIBtn: Button = null!; // 商店按钮
    @property(Label)
    tableInfoLb: Label = null!; // 表格信息
    /**
     * 视图创建时调用
     */
    onCreate() {
        // 按钮点击事件
        this.openRenameUIBtn.node.on(Button.EventType.CLICK, () => {
            const param = { name: 'BaoZi', address: 'CN' };
            Context.getService(ViewService).openUI(ViewKeys.RenameView, param);
        });
        this.tipBtn.node.on(Button.EventType.CLICK, () => {
            const message = "恭喜获得 <img src='apple'/>x" + GameUtil.getRandomInt(1, 10);
            Context.getService(ToastService).showToast({
                message,
            });
        });
        this.httpRequestBtn.node.on(Button.EventType.CLICK, () => {
            const config: IHttpRequestConfig = {
                url: 'http://getinfo-aipet-xdfcoaizwj.cn-hangzhou.fcapp.run?token=“13213213”', // 示例接口
                method: HttpMethod.GET,
            };
            Context.getService(HttpService).request(config).then((res: IHttpResponse) => {
                console.log('Promise 请求成功', JSON.stringify(res.data));
                const randomX = GameUtil.getRandomInt(1, 30);
                let x = "x";
                for (let i = 0; i < randomX; i++) {
                    x += "x";
                }
                Context.getService(ToastService).showToast({
                    message: '请求成功: ' + x,
                });
            }).catch((error) => {
                console.error('请求失败', error.errMsg);
                Context.getService(ToastService).showToast({
                    message: '请求失败: ' + error.errMsg,
                });
            });
        });
        this.openSettingUIBtn.node.on(Button.EventType.CLICK, () => {
            Context.getService(ViewService).openUI(ViewKeys.SettingView).then((view) => {
                console.log('打开 View 成功', view);
            }).catch((err) => {
                console.error('打开 View 失败', err);
            });
        });

        this.openShopUIBtn.node.on(Button.EventType.CLICK, () => {
            Context.getService(ViewService).openUI(ViewKeys.ShopView);
        });

        // 读取表格
        this.tableRead();
    }

    protected onEnable(): void {
        // 播放背景音乐
        const audioService = Context.getService(AudioService);
        audioService.playBgm("bg1");
    }


    /**
     * 表格读取
     * 演示如何读取表格数据
     */
    async tableRead() {
        const items = await Context.getService(TableReaderService).read<IItem>("Item");
        console.log("读取 Item 表格成功，数据条数:", items.length);
        this.tableInfoLb.string = "Item表:\n";
        items.forEach(item => {
            this.tableInfoLb.string += `${item.id} ${item.title} ${item.type} ${item.quality} ${item.desc}\n`;
        });
        this.tableInfoLb.string += "\nHero表:\n";
        const heros = await Context.getService(TableReaderService).read<IHero>("Hero");
        console.log("读取 Hero 表格成功，数据条数:", heros.length);
        heros.forEach(hero => {
            this.tableInfoLb.string += `${hero.id} ${hero.atkValue} ${hero.blood} ${hero.defend} ${hero.heroName}\n`;
        });
    }
}