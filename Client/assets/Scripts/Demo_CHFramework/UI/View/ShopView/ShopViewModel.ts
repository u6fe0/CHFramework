import { ViewModelBase, BindModel } from '../../../../CHFramework/Framework';
import { ShopModel } from './ShopModel';

@BindModel(ShopModel)
export class ShopViewModel extends ViewModelBase<ShopModel> {
    constructor() {
        super();
    }
}


