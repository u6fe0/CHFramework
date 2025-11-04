import {
  _decorator,
  Asset,
  AssetManager,
  assetManager,
  resources,
} from "cc";

/**
 * 资源加载工具
 */

export class ResUtil {
  /**
   * 异步加载Bundle资源
   * @param bundle
   * @param name
   * @param Type
   * @returns
   */
  static async loadBundleRes<T extends Asset>(
    bundleName: string,
    resName: string,
    Type: new () => T
  ): Promise<T> {
    const bundle = await ResUtil.loadBundle(bundleName);
    return new Promise((resolve, reject) => {
      bundle.load(resName, Type, (err: Error, res: T) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
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
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      resources.load(name, Type, (err: Error, res: T) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }
  /**
   * 异步加载Bundle
   * @param name
   * @returns
   */
  private static loadBundle(name: string): Promise<AssetManager.Bundle> {
    return new Promise((resolve, reject) => {
      assetManager.loadBundle(
        name,
        (err: Error, bundle: AssetManager.Bundle) => {
          if (err) {
            return reject(err);
          }
          resolve(bundle);
        }
      );
    });
  }
}
