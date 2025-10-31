import { BindModel, ViewModelBase } from '../../../../Runtime/Framework';
import { MainModel } from './MainModel';
/**
 * Example：主界面视图模型
 */
@BindModel(MainModel)
export class MainViewModel extends ViewModelBase<MainModel> {
    constructor() {
        super();
    }
} 