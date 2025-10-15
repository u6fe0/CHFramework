import { AssetManager, JsonAsset } from "cc";
import { TableReaderBase } from "../Base/TableReaderBase";
import { ITableModel } from "../Base/ITableModel";
/**
 * JSON文件读取
 */
export class JsonReader extends TableReaderBase {
    async read(bundleName: string, tablePath: string): Promise<Array<ITableModel>> {
        return new Promise((resolve, reject) => {
            const bundle = AssetManager.instance.getBundle(bundleName);
            if (!bundle) {
                return reject(new Error(`[TableReaderBase] 未找到 bundle: ${bundleName}`));
            }
            bundle.load(tablePath, JsonAsset, (err, asset) => {
                if (err || !asset) {
                    return reject(new Error(`[TableReaderBase] 加载表格失败: bundleName=${bundleName}, tablePath=${tablePath}`));
                }
                resolve(asset.json as Array<ITableModel>);
            });
        });
    }
}