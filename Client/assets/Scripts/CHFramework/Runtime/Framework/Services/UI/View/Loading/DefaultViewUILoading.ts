import { ViewLoadingUIBase } from "./ViewLoadingUIBase";
import { _decorator, Canvas } from 'cc';

/**
 * 默认透明的Loading界面
 */
export class DefaultViewUILoading extends ViewLoadingUIBase {
    /**
     * 更新进度 0~1
     * @param value 
     */
    updateProgress(value: number): void {
        console.warn(`[DefaultViewUILoading] Loading... ${Math.floor(value * 100)}%`);
    }
}