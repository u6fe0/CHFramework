import { sys } from "cc";
import { GameUtil } from "../../../../CHFramework/Framework";
import { DefaultPlayerModel, IPlayerPrefModel } from "./Model/IPlayerPrefModel";
/**
 * 简单的玩家存档服务示例
 */
// 示例配置 ID
const KEY_PLAYER_ID = "ch_framework_playerId";
export class PlayerPrefService {
    // 玩家数据模型
    private _playerModel: IPlayerPrefModel;
    get playerModel(): IPlayerPrefModel {
        return this._playerModel;
    }
    constructor() {
        const localData = sys.localStorage.getItem(KEY_PLAYER_ID);
        if (!localData) {
            // 单机游戏可以随机生成一个唯一ID
            const randomId = KEY_PLAYER_ID + "_" + Date.now() + "_" + GameUtil.getRandomInt(1000, 9999);
            this._playerModel = JSON.parse(JSON.stringify(DefaultPlayerModel));
            this._playerModel.id = randomId;
            sys.localStorage.setItem(KEY_PLAYER_ID, JSON.stringify(this._playerModel));
        } else {
            this._playerModel = JSON.parse(localData);
        }
    }
    /**
     * 存档
     */
    save() {
        sys.localStorage.setItem(KEY_PLAYER_ID, JSON.stringify(this._playerModel));
    }
}