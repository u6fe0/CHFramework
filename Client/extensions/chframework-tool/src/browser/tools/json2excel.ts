import path from 'path';
import { promises as fs } from 'fs';
import ExcelJS from 'exceljs';

type Row = any[];

/**
 * 将 JSON 数据同步回对应的 Excel 文件（只修改数值，完整保留格式）
 * @param jsonPath JSON 文件路径
 * @param excelDir Excel 目录
 * @returns 是否成功
 */
export async function syncJsonToExcel(jsonPath: string, excelDir: string): Promise<boolean> {
    const jsonName = path.parse(jsonPath).name;
    const excelPath = path.join(excelDir, `${jsonName}.xlsx`);

    // 1. 读取 JSON 数据
    let jsonData: any[];
    try {
        const content = await fs.readFile(jsonPath, 'utf8');
        jsonData = JSON.parse(content);
        if (!Array.isArray(jsonData)) {
            console.error(`[json2excel] JSON 不是数组: ${jsonPath}`);
            return false;
        }
    } catch (e: any) {
        console.error(`[json2excel] 读取 JSON 失败: ${jsonPath} -> ${e?.message || e}`);
        return false;
    }

    // 2. 使用 Buffer 方式读取 Excel（避免 fs.constants 问题）
    const workbook = new ExcelJS.Workbook();
    try {
        const fileBuffer = await fs.readFile(excelPath);
        await workbook.xlsx.load(fileBuffer as any);
    } catch (e: any) {
        console.error(`[json2excel] 读取 Excel 失败: ${excelPath} -> ${e?.message || e}`);
        return false;
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
        console.error(`[json2excel] Excel 无工作表: ${excelPath}`);
        return false;
    }

    // 4. 读取表头信息（第2行：类型，第3行：字段名）
    const typeRow: Row = [];
    const keyRow: Row = [];
    
    worksheet.getRow(2).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        typeRow[colNumber - 1] = cell.value?.toString().trim().toLowerCase() || '';
    });
    worksheet.getRow(3).eachCell({ includeEmpty: true }, (cell, colNumber) => {
        keyRow[colNumber - 1] = cell.value?.toString().trim() || '';
    });

    if (keyRow.length === 0) {
        console.error(`[json2excel] 表头为空: ${excelPath}`);
        return false;
    }

    // 5. 获取第4行的样式作为数据行模板（用于新增行）
    const templateRow = worksheet.getRow(4);
    interface CellStyle {
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
        border?: Partial<ExcelJS.Borders>;
        fill?: ExcelJS.Fill;
        numFmt?: string;
    }
    const templateStyles: CellStyle[] = [];
    templateRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        templateStyles[colNumber - 1] = {
            font: cell.font ? { ...cell.font } : undefined,
            alignment: cell.alignment ? { ...cell.alignment } : undefined,
            border: cell.border ? { ...cell.border } : undefined,
            fill: cell.fill ? { ...cell.fill } as ExcelJS.Fill : undefined,
            numFmt: cell.numFmt
        };
    });

    // 6. 计算当前数据行数和新数据行数
    const currentRowCount = worksheet.rowCount;
    const newDataRowCount = jsonData.length;
    const dataStartRow = 4; // 数据从第4行开始
    const currentDataRowCount = currentRowCount - dataStartRow + 1;

    // 7. 读取 Excel 现有数据，用于比较是否有变化
    const existingData: any[] = [];
    for (let rowIdx = 0; rowIdx < currentDataRowCount; rowIdx++) {
        const excelRowNum = dataStartRow + rowIdx;
        const row = worksheet.getRow(excelRowNum);
        const item: any = {};
        for (let colIdx = 0; colIdx < keyRow.length; colIdx++) {
            const key = keyRow[colIdx];
            if (!key) continue;
            const cell = row.getCell(colIdx + 1);
            item[key] = cell.value;
        }
        existingData.push(item);
    }

    // 8. 比较数据是否有变化
    const normalize = (val: any, type: string): any => {
        if (val === undefined || val === null || val === '') {
            return type === 'number' ? 0 : '';
        }
        if (type === 'number') {
            return Number(val) || 0;
        }
        return String(val);
    };

    let hasChanges = existingData.length !== jsonData.length;
    if (!hasChanges) {
        outer: for (let rowIdx = 0; rowIdx < jsonData.length; rowIdx++) {
            const jsonItem = jsonData[rowIdx];
            const excelItem = existingData[rowIdx];
            for (let colIdx = 0; colIdx < keyRow.length; colIdx++) {
                const key = keyRow[colIdx];
                if (!key) continue;
                const type = typeRow[colIdx] || 'string';
                const jsonVal = normalize(jsonItem[key], type);
                const excelVal = normalize(excelItem[key], type);
                if (jsonVal !== excelVal) {
                    hasChanges = true;
                    break outer;
                }
            }
        }
    }

    // 9. 如果没有变化，跳过写入
    if (!hasChanges) {
        console.log(`[json2excel] 跳过（无变化）: ${jsonPath}`);
        return true;
    }

    // 10. 删除多余的旧数据行（如果新数据比旧数据少）
    if (currentRowCount > dataStartRow + newDataRowCount - 1) {
        for (let r = currentRowCount; r >= dataStartRow + newDataRowCount; r--) {
            worksheet.spliceRows(r, 1);
        }
    }

    // 11. 写入新数据
    for (let rowIdx = 0; rowIdx < jsonData.length; rowIdx++) {
        const item = jsonData[rowIdx];
        const excelRowNum = dataStartRow + rowIdx;
        
        // 获取或创建行
        let row = worksheet.getRow(excelRowNum);
        
        for (let colIdx = 0; colIdx < keyRow.length; colIdx++) {
            const key = keyRow[colIdx];
            if (!key) continue;

            const value = item[key];
            const type = typeRow[colIdx] || 'string';
            const colNum = colIdx + 1;
            const cell = row.getCell(colNum);

            // 设置值
            if (value === undefined || value === null) {
                cell.value = type === 'number' ? 0 : '';
            } else if (type === 'number') {
                cell.value = Number(value) || 0;
            } else {
                cell.value = String(value);
            }

            // 对于新增的行，应用模板样式
            if (excelRowNum > currentRowCount && templateStyles[colIdx]) {
                const style = templateStyles[colIdx];
                if (style.font) cell.font = style.font;
                if (style.alignment) cell.alignment = style.alignment;
                if (style.border) cell.border = style.border;
                if (style.fill) cell.fill = style.fill;
                if (style.numFmt) cell.numFmt = style.numFmt;
            }
        }
        
        row.commit();
    }

    // 12. 写回 Excel（使用 Buffer 方式避免 fs.constants 问题）
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        await fs.writeFile(excelPath, Buffer.from(buffer));
        console.log(`[json2excel] 同步成功: ${jsonPath} -> ${excelPath} (${jsonData.length} 行)`);
        return true;
    } catch (e: any) {
        console.error(`[json2excel] 写入 Excel 失败: ${excelPath} -> ${e?.message || e}`);
        return false;
    }
}

/**
 * 批量将 JSON 目录下的所有文件同步回 Excel
 * @param jsonDir JSON 目录
 * @param excelDir Excel 目录
 * @returns 成功同步的文件列表
 */
export async function syncAllJsonToExcel(jsonDir: string, excelDir: string): Promise<string[]> {
    const files = (await fs.readdir(jsonDir))
        .filter(f => f.toLowerCase().endsWith('.json'));

    const synced: string[] = [];
    for (const f of files) {
        const jsonPath = path.join(jsonDir, f);
        const success = await syncJsonToExcel(jsonPath, excelDir);
        if (success) {
            synced.push(jsonPath);
        }
    }

    console.log(`[json2excel] 批量同步完成: ${synced.length}/${files.length}`);
    return synced;
}
