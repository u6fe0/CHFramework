/**
 * 玩家数据模型接口
 */
export interface IPlayerPrefModel {
   id: string;
   nickName: string;
   renameCnt: number;
   lv: number;
}

export const DefaultPlayerModel: IPlayerPrefModel = {
   id: '',
   nickName: '关羽',
   renameCnt: 10,
   lv: 1
};