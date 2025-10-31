import { BindModel, ViewModelBase } from "../../../../Runtime/Framework";
import { DialogModel } from "./DialogModel";

@BindModel(DialogModel)
export class DialogViewModel extends ViewModelBase<DialogModel> {
    constructor() {
        super();
    }
}


