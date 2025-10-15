import { BindModel, ViewModelBase } from "../../../../CHFramework/Framework";
import { DialogModel } from "./DialogModel";

@BindModel(DialogModel)
export class DialogViewModel extends ViewModelBase<DialogModel> {
    constructor() {
        super();
    }
}


