import { ITableModel } from "./ITableModel";
/**
 * 表格读取接口
 */
export interface ITableReader {
    /**
     * 读取表格数据
     * @param tableName 表格名称
     * @returns 表格数据
     */
    read(bundle: string, tableName: string): Promise<Array<ITableModel>>;
}