import { UIKey } from '../../CHFramework/Framework';
const defaultBundle = 'resources';
const defaultPathPrefix = 'Demo_CHFramework/Prefab/UI/View/';
export const ViewKeys = {
    MainView: new UIKey(defaultPathPrefix + 'MainView', defaultBundle),
    RenameView: new UIKey(defaultPathPrefix + 'RenameView', defaultBundle),
    DialogView: new UIKey(defaultPathPrefix + 'DialogView', defaultBundle),
    SettingView: new UIKey(defaultPathPrefix + 'SettingView', defaultBundle),
    ShopView: new UIKey(defaultPathPrefix + 'ShopView/ShopView', defaultBundle),
    // ...
};