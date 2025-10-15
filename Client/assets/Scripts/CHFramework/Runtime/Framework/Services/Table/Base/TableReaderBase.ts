import { ITableReader } from "./ITableReader";
import { ITableModel } from "./ITableModel";

export abstract class TableReaderBase implements ITableReader {
    abstract read(bundleName: string, tablePath: string): Promise<Array<ITableModel>>;
}
