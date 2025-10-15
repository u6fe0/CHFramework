import { Context, EventTrigger, ViewModelBase, ViewService, AsyncCommand, GameUtil, BindModel, SimpleCommand, CompositeCommand } from '../../../../CHFramework/Framework';
import { GameEvent } from '../../../Constant/GameEvent';
import { ViewKeys } from '../../../Constant/ViewKeys';
import { AudioService } from '../../../Services/Audio/AudioService';
import { ToastService } from '../../Toast/ToastService';
import { RenameModel } from './RenameModel';

/**
 * Example：改名视图模型
 */
@BindModel(RenameModel)
export class RenameViewModel extends ViewModelBase<RenameModel> {
    // 供 View 绑定的可观察属性
    get nickName() { return this.model.nickName }
    get renameCnt() { return this.model.renameCnt }
    get nextNickName() { return this.model.nextNickName }
    // 命令-改名
    readonly renameCmd: AsyncCommand;

    constructor() {
        super();
        // 1. 创建命令，将执行逻辑和条件判断委托给 Model
        this.renameCmd = new AsyncCommand(this.rename.bind(this), () => {
            return this.canRename(this.nextNickName.value) === null;
        });
        // 2. 监听相关属性变化，触发命令状态更新
        this.nickName.on(this.renameCmd.raiseExecuteStateChanged);
        this.renameCnt.on(this.renameCmd.raiseExecuteStateChanged);
        this.nextNickName.on(this.renameCmd.raiseExecuteStateChanged);
    }
    /**
     * 执行改名。
     * ViewModel 在这里扮演“协调者”的角色。
     */
    async rename(): Promise<boolean> {
        // 委托给 Model 进行业务校验
        const error = this.canRename(this.nextNickName.value);
        if (error) {
            Context.getService(ToastService).showToast({ message: error });
            return false;
        }
        // UI 反馈：显示加载提示
        Context.getService(ToastService).showToast({ message: "正在改名，请稍候...模拟请求中" });
        await GameUtil.waitFrames(100); // 模拟异步
        // 委托给 Model 执行核心业务操作
        this.model.performRename(this.nextNickName.value);
        // UI 反馈：弹窗、音效、全局事件等
        const richTextContent = `恭喜你，成功将昵称改为<color=#00ff00>${this.nextNickName.value}</color>！`;
        Context.getService(ViewService).openUI(ViewKeys.DialogView, { title: '改名成功', content: richTextContent });
        Context.getService(AudioService).playOneShot("success");
        EventTrigger.dispatch(GameEvent.ReNameSuccess, { newName: this.nextNickName.value });

        return true;
    }
    /**
     * 检查是否可以改名
     * @param newName 要修改的新昵称
     * @returns 错误信息，如果返回 null 则表示可以改名
     */
    public canRename(newName: string): string | null {
        if (!newName || newName.trim().length === 0) {
            return "改名失败：昵称不能为空!";
        }
        if (this.nickName.value === newName) {
            return "改名失败：新昵称不能与当前昵称相同!";
        }
        if (this.renameCnt.value <= 0) {
            return "改名失败：缺少改名卡!";
        }
        return null;
    }
    /**
     * 增加改名卡
     */
    addRenameCard() {
        console.log('增加改名卡');
        this.model.addRenameCard();
    }
}