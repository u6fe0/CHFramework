
import { Canvas, instantiate, Label, Prefab, ProgressBar, Tween, tween, UIOpacity, } from 'cc';
import { GameUtil, ViewLoadingUIBase } from '../../../Runtime/Framework';
// 预制体路径
const prefabPath = "Demo_CHFramework/Prefab/UI/Loading/CustomViewLoadingUI";
/**
 * 带加载进度的Loading界面
 */
export class CustomViewLoadingUI extends ViewLoadingUIBase {
    progressBar: ProgressBar; // 显示进度条
    tipLabel: Label;  // 显示提示文本
    opacityComp: UIOpacity;
    constructor(canvas: Canvas) {
        super(canvas);
        // 挂载UI组件
        GameUtil.loadResource(prefabPath, Prefab).then(this.onReady.bind(this));
    }
    /**
     * 初始化UI组件
     * @param prefab 
     */
    onReady(prefab: Prefab) {
        const uiNode = instantiate(prefab);
        this.node.addChild(uiNode);
        this.opacityComp = uiNode.getComponent(UIOpacity);
        this.opacityComp.opacity = 0;
        this.tipLabel = uiNode.getChildByName("TipLabel")?.getComponent(Label);
        this.progressBar = uiNode.getChildByName("ProgressBar")?.getComponent(ProgressBar);
        this.updateProgress(0);
    }
    /**
     * 显示
     */
    show(): void {
        super.show();
        if (this.opacityComp) {
            Tween.stopAllByTarget(this.opacityComp);
            this.opacityComp.opacity = 0;
            tween(this.opacityComp)
                .delay(1)
                .to(1, { opacity: 255 })
                .start();
        }
    }
    /**
     * 更新进度 0~1
     * @param value 
     */
    updateProgress(value: number): void {
        if (this.progressBar) {
            this.progressBar.progress = value;
        }
        if (this.tipLabel) {
            this.tipLabel.string = `加载中...${Math.floor(value * 100)}%`;
        }
    }
}