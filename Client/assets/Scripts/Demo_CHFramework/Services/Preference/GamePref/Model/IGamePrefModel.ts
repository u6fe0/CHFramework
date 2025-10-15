/**
 * 游戏配置数据模型接口
 */
export interface IGamePrefModel {
   bgmVolume: number; // 背景音乐音量 0.0 ~ 1.0
   isBgmOn: boolean; // 是否开启背景音乐
   sfxVolume: number; // 音效音量 0.0 ~ 1.0
   isSfxOn: boolean; // 是否开启音效
}

/**
 * 默认游戏配置
 */
export const DefaultGamePrefModel: IGamePrefModel = {
   bgmVolume: 1.0,
   isBgmOn: true,
   sfxVolume: 1.0,
   isSfxOn: true,
};