import { name } from '../../package.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';
import { convertExcelDir } from './tools/excel2json';
import { generateModels } from './tools/excel2model';
import { generateProtoTypes } from './tools/protoToTs';
import { syncAllJsonToExcel } from './tools/json2excel';

export const methods = {
    async open_excel_tool() {
        Editor.Panel.open(`${name}.excelToolPanel`);
    },
    async open_protobuf_generator() {
        Editor.Panel.open(`${name}.protobufToolPanel`);
    },
    /**
     * 转换 Excel 文件
     * @param options 
     * @returns 
     */
    async convertExcel(options: { excelDir: string; jsonOutDir: string; modelOutDir: string; FrameworkTS: string }): Promise<boolean> {
        const { excelDir, jsonOutDir, modelOutDir, FrameworkTS } = options || ({} as any);
        if (!excelDir || !jsonOutDir || !modelOutDir || !FrameworkTS) {
            console.error('[excel-tool] 参数不完整');
            return false;
        }
        if (!fs.existsSync(excelDir)) { console.error('[excel-tool] Excel 目录不存在:', excelDir); return false; }

        // 1) excel2json
        try {
            const files = await convertExcelDir(excelDir, jsonOutDir, { compact: true });
            if (!files.length) {
                console.warn('[excel-tool] excel2json 无输出');
            }
        } catch (e: any) {
            console.error('[excel-tool] excel2json 失败:', e?.message || e);
            return false;
        }

        // 2) excel2model
        try {
            const outFile = path.join(modelOutDir, 'TableModel.ts');
            // FrameworkTS 相对于 modelOutDir 的路径
            const relPath = path.relative(modelOutDir, FrameworkTS).replace(/\\/g, '/').replace(/\.ts$/, '');
            // ../../CHFramework/Framework
            const importPath = relPath.startsWith('.') ? relPath : `./${relPath}`;
            await generateModels(excelDir, outFile, { importPath });
        } catch (e: any) {
            console.error('[excel-tool] excel2model 失败:', e?.message || e);
            return false;
        }        // 3) 刷新资源（JSON 目录 + 生成的 TS 文件）
        try {
            const projectPath = (Editor.Project && (Editor.Project as any).path) || '';
            const assetsDir = path.join(projectPath, 'assets');
            
            // 统一路径格式进行比较
            const normalizedAssetsDir = path.normalize(assetsDir);
            const normalizedJsonOutDir = path.normalize(jsonOutDir);
            const normalizedModelOutDir = path.normalize(modelOutDir);
            
            if (projectPath) {
                // 刷新 JSON 文件
                if (normalizedJsonOutDir.startsWith(normalizedAssetsDir)) {
                    const dirUrl = await Editor.Message.request('asset-db', 'query-url', jsonOutDir);
                    if (dirUrl) {
                        await Editor.Message.send('asset-db', 'refresh-asset', dirUrl);
                    }
                    
                    const files = fs.readdirSync(jsonOutDir).filter(f => f.toLowerCase().endsWith('.json'));
                    let refreshedCount = 0;
                    for (const f of files) {
                        const filePath = path.join(jsonOutDir, f);
                        const fileUrl = await Editor.Message.request('asset-db', 'query-url', filePath);
                        if (fileUrl) {
                            await Editor.Message.send('asset-db', 'refresh-asset', fileUrl);
                            await Editor.Message.send('asset-db', 'reimport-asset', fileUrl);
                            refreshedCount++;
                        }
                    }
                    console.log(`[excel-tool] 已刷新 ${refreshedCount} 个 JSON 文件`);
                }
                
                // 刷新 TableModel.ts
                const modelFile = path.join(modelOutDir, 'TableModel.ts');
                const normalizedModelFile = path.normalize(modelFile);
                if (normalizedModelFile.startsWith(normalizedAssetsDir)) {
                    const fileUrl = await Editor.Message.request('asset-db', 'query-url', modelFile);
                    if (fileUrl) {
                        await Editor.Message.send('asset-db', 'refresh-asset', fileUrl);
                        await Editor.Message.send('asset-db', 'reimport-asset', fileUrl);
                        console.log('[excel-tool] 已刷新 TableModel.ts');
                    }
                }
            }
        } catch (e: any) {
            console.warn('[excel-tool] 刷新资源失败:', e?.message || e);
        }

        return true;
    },
    /**
     * 将 JSON 同步回 Excel
     * @param options 
     * @returns 
     */
    async syncJsonToExcel(options: { jsonDir: string; excelDir: string }): Promise<boolean> {
        const { jsonDir, excelDir } = options || ({} as any);
        if (!jsonDir || !excelDir) {
            console.error('[excel-tool] syncJsonToExcel 参数不完整');
            return false;
        }
        if (!fs.existsSync(jsonDir)) { 
            console.error('[excel-tool] JSON 目录不存在:', jsonDir); 
            return false; 
        }
        if (!fs.existsSync(excelDir)) { 
            console.error('[excel-tool] Excel 目录不存在:', excelDir); 
            return false; 
        }

        try {
            const synced = await syncAllJsonToExcel(jsonDir, excelDir);
            if (!synced.length) {
                console.warn('[excel-tool] syncJsonToExcel 无文件同步');
                return false;
            }
            console.log(`[excel-tool] 成功同步 ${synced.length} 个文件到 Excel`);
            return true;
        } catch (e: any) {
            console.error('[excel-tool] syncJsonToExcel 失败:', e?.message || e);
            return false;
        }
    },
    /**
     * 转换 Protobuf 文件
     * @param options 
     * @returns 
     */
    async convertProtobuf(options: { protoDir: string; outDir: string; keepJs?: boolean }): Promise<boolean> {
        const { protoDir, outDir, keepJs } = options || ({} as any);
        if (!protoDir || !outDir) {
            console.error('[proto-tool] 参数不完整');
            return false;
        }
        if (!fs.existsSync(protoDir)) {
            console.error('[proto-tool] Proto 目录不存在:', protoDir);
            return false;
        }

        try {
            const result = await generateProtoTypes(protoDir, outDir, { keepJs });
            if (!result.count) {
                console.warn('[proto-tool] 无输出文件');
            }
        } catch (e: any) {
            console.error('[proto-tool] 转换失败:', e?.message || e);
            return false;
        }        // 刷新资源
        try {
            const projectPath = (Editor.Project && (Editor.Project as any).path) || '';
            const assetsDir = path.join(projectPath, 'assets');
            
            // 统一路径格式进行比较
            const normalizedAssetsDir = path.normalize(assetsDir);
            const normalizedOutDir = path.normalize(outDir);
            
            if (projectPath && normalizedOutDir.startsWith(normalizedAssetsDir)) {
                const dirUrl = await Editor.Message.request('asset-db', 'query-url', outDir);
                if (dirUrl) {
                    await Editor.Message.send('asset-db', 'refresh-asset', dirUrl);
                }
                
                // 刷新每个生成的文件
                const files = fs.readdirSync(outDir).filter(f => f.toLowerCase().endsWith('.ts') || f.toLowerCase().endsWith('.js'));
                let refreshedCount = 0;
                for (const f of files) {
                    const filePath = path.join(outDir, f);
                    const fileUrl = await Editor.Message.request('asset-db', 'query-url', filePath);
                    if (fileUrl) {
                        await Editor.Message.send('asset-db', 'refresh-asset', fileUrl);
                        await Editor.Message.send('asset-db', 'reimport-asset', fileUrl);
                        refreshedCount++;
                    }
                }
                console.log(`[proto-tool] 已刷新 ${refreshedCount} 个 Proto 文件`);
            }
        } catch (e: any) {
            console.warn('[proto-tool] 刷新资源失败:', e?.message || e);
        }

        return true;
    }
};

export async function load() {
    console.log(`load ${name}`);
}

export function unload() {
    console.log(`unload ${name}`);
}