import { ViewModelBase, BindModel } from '../../../../Runtime/Framework';
import { ShopModel } from './ShopModel';

@BindModel(ShopModel)
export class ShopViewModel extends ViewModelBase<ShopModel> {
    constructor() {
        super();
    }
}


