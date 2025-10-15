import { Context, ModelBase, Observable } from '../../../../CHFramework/Framework';
import { PlayerPrefService } from '../../../Services/Preference/PlayerPref/PlayerPrefService';
/**
 * Example：改名数据模型
 */
export class RenameModel extends ModelBase {
    public nickName: Observable<string>;
    public renameCnt: Observable<number>;
    public nextNickName: Observable<string>;

    constructor() {
        super();
        // 构造时直接从持久化层加载数据
        const playerPrefService = Context.getService(PlayerPrefService);
        this.nickName = new Observable( playerPrefService.playerModel.nickName);
        this.renameCnt = new Observable(playerPrefService.playerModel.renameCnt);
        this.nextNickName = new Observable("张飞");
    }
    /**
     * 执行改名逻辑
     * @param newName 
     */
    public performRename(newName: string): void {
        this.nickName.value = newName;
        this.renameCnt.value -= 1;
        this.save(); // 执行完操作后，立即保存
    }
    /**
     * 增加改名卡
     */
    addRenameCard(): void {
        this.renameCnt.value += 1;
        this.save(); // 立即保存
    }
    /**
     * 将模型数据保存到持久化层
     */
    private save(): void {
        const playerPrefService = Context.getService(PlayerPrefService);
        playerPrefService.playerModel.nickName = this.nickName.value;
        playerPrefService.playerModel.renameCnt = this.renameCnt.value;
        playerPrefService.save();
    }
}