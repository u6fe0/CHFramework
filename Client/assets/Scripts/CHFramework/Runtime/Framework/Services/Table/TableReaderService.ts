import { ITableModel } from "./Base/ITableModel";
import { TableReaderBase } from "./Base/TableReaderBase";
/**
 * 表格读取配置
 */
interface ITableReaderConfig {
    TableReaderClass: new () => TableReaderBase;
    bundleName: string;
    pathPrefix: string;
}
/**
 * 表格读取服务
 * 统一管理表格数据的读取
 */
export class TableReaderService {
    // 表格读取器
    tableReader: TableReaderBase;
    config: ITableReaderConfig;
    constructor(config: ITableReaderConfig) {
        this.tableReader = new config.TableReaderClass();
        this.config = config;
    }
    /**
     * 读取表格数据
     * @param tableName 表格名称
     * @returns 表格对象
     */
    async read<T extends ITableModel>(tableName: string): Promise<Array<T>> {
        const tablePath = `${this.config.pathPrefix}/${tableName}`;
        const model = await this.tableReader.read(this.config.bundleName, tablePath);
        return model as Array<T>;
    }
}