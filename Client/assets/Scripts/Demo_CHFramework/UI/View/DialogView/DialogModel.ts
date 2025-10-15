import { ModelBase } from '../../../../CHFramework/Framework';
/**
 * 对话框数据模型
 */
export class DialogModel extends ModelBase {
    title: string;
    content: string;
    confirm?: Function;
    cancel?: Function;
}