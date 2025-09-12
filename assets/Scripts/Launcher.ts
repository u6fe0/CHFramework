import { _decorator, Component, director, Director, Game, Node } from 'cc';
import { UIKey, UIManager } from './CHFramework/Framework';
import { ViewKeys } from './Game/Constant/ViewKeys';
const { ccclass } = _decorator;

@ccclass('Launcher')
export class Launcher extends Component {

    public static instance: Launcher = null;

    onLoad() {
        Launcher.instance = this;
        director.addPersistRootNode(this.node);

        UIManager.instance.init(this.node);
    }

    // 测试打开 UI
    openUI() {
        UIManager.instance.open(ViewKeys.Player);
    }
}


