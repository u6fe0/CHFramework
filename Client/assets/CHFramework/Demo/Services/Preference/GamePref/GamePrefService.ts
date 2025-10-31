import { sys } from "cc";
import { DefaultGamePrefModel, IGamePrefModel } from "./Model/IGamePrefModel";
/**
 * 游戏配置服务示例
 */
// 示例配置 ID
const KEY_GAME_PREF = "ch_framework_gamePref";
export class GamePrefService {
    // 游戏配置数据模型
    private _gamePrefModel: IGamePrefModel;
    get gamePrefModel(): IGamePrefModel {
        return this._gamePrefModel;
    }
    constructor() {
        const localData = sys.localStorage.getItem(KEY_GAME_PREF);
        if (!localData) {
            this._gamePrefModel = JSON.parse(JSON.stringify(DefaultGamePrefModel));
            sys.localStorage.setItem(KEY_GAME_PREF, JSON.stringify(this._gamePrefModel));
        } else {
            this._gamePrefModel = JSON.parse(localData);
        }
    }
    /**
     * 存档
     */
    save() {
        sys.localStorage.setItem(KEY_GAME_PREF, JSON.stringify(this._gamePrefModel));
    }
}