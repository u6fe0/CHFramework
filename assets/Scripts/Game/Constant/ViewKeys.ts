import { UIKey } from '../../CHFramework/Framework';
const defaultBundle = 'resources';
const defaultPathPrefix = 'prefab/ui/view/';
export const ViewKeys = {
    Login: new UIKey(defaultPathPrefix + 'Login', defaultBundle),
    Player: new UIKey(defaultPathPrefix + 'PlayerView', defaultBundle),
    Shop: new UIKey(defaultPathPrefix + 'Shop', defaultBundle),
    // ...
};