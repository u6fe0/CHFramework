import { Asset, director, Director, resources } from "cc";

/**
 * 游戏工具类
 */
export class GameUtil {
    /**
     * 等待x帧
     * @param frameCnt 
     * @returns 
     */
    static async waitFrames(frameCnt: number) {
        return new Promise((resolve) => {
            let cnt = 0;
            const callback = () => {
                cnt++;
                if (cnt >= frameCnt) {
                    resolve(null);
                    director.off(Director.EVENT_BEGIN_FRAME, callback);
                }
            };
            director.on(Director.EVENT_BEGIN_FRAME, callback);
        });
    }
    /**
     * 等待一帧
     * @returns 
     */
    static async waitAFrame() {
        return this.waitFrames(1);
    }
    /**
     * 异步加载资源
     * @param name
     * @param Type
     * @returns
     */
    static loadResource<T extends Asset>(
        name: string,
        Type: new () => T
    ): Promise<T | null> {
        return new Promise((resolve, reject) => {
            resources.load(name, Type, (err: Error | null, res: T) => {
                if (err) {
                    console.error(`[GameUtil] LoadResource ${name} failed: ${err}`);
                    return reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
    /**
     * 随机获取指定范围中的整数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @method getRandomInt
     */
    static getRandomInt(min: number, max: number): number {
        const r = Math.random();
        const rr = r * (max - min + 1) + min;
        return Math.floor(rr);
    }

    /**
     * 随机获取指定范围中的浮点数
     * @param {number} min 最小值
     * @param {number} max 最大值
     * @method getRandomInt
     */
    static getRandomFloat(min: number, max: number): number {
        [min, max] = min > max ? [max, min] : [min, max];
        const r = Math.random();
        const rr = r * (max - min) + min;
        return rr;
    }

    /**
     * 将数值限制在指定范围内
     * @param value 待限制的数值
     * @param min 最小值
     * @param max 最大值
     * @returns 限制后的数值
     */
    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}