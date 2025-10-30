import { _decorator, Button } from 'cc';
import { ShopViewModel } from './ShopViewModel';
const { ccclass, property } = _decorator;
import { ViewBase, BindViewModel, Context, TableReaderService, ViewService } from '../../../../CHFramework/Framework';
import { CHScrollView } from '../../../../Plugins/UIComponent/CHScrollView';
import { ICard } from '../../../TableModel/TableModel';
import { ViewKeys } from '../../../Constant/ViewKeys';
/**
 * 视图
 */

@ccclass('ShopView')
@BindViewModel(ShopViewModel)
export class ShopView extends ViewBase<ShopViewModel> {
    @property({ type: CHScrollView })
    scrollView: CHScrollView;
    @property({ type: Button })
    closeButton: Button;

    /**
     * 视图创建时调用
     */
    onCreate(): void {
        this.closeButton.node.on(Button.EventType.CLICK, () => {
            Context.getService(ViewService).closeUI(ViewKeys.ShopView)
        });
        this.loadCardPanel();
    }
    /**
 * 异步加载图鉴数据
 */
    async loadCardPanel() {
        const cards = await Context.getService(TableReaderService).read<ICard>("Card");
        // 初始化
        this.scrollView.init(cards);
    }
}
