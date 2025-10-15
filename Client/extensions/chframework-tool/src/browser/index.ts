import { name } from '../../package.json' with { type: 'json' };
import fs from 'fs';
import path from 'path';
import { convertExcelDir } from './tools/excel2json';
import { generateModels } from './tools/excel2model';

export const methods = {
    async open_excel_tool() {
        Editor.Panel.open(`${name}.excelToolPanel`);
    },
    async open_mvvm_generator() {
        Editor.Panel.open(`${name}.mvvmGeneratorPanel`);
    },

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
        }

        // 3) 刷新资源（JSON 目录 + 生成的 TS 文件）
        try {
            const projectPath = (Editor.Project && (Editor.Project as any).path) || '';
            const assetsDir = path.join(projectPath, 'assets');
            if (projectPath) {
                // JSON 目录
                if (jsonOutDir.startsWith(assetsDir)) {
                    const dirUrl = await Editor.Message.request('asset-db', 'query-url', jsonOutDir);
                    if (dirUrl) {
                        await Editor.Message.send('asset-db', 'refresh-asset', dirUrl);
                        const files = fs.readdirSync(jsonOutDir).filter(f => f.toLowerCase().endsWith('.json'));
                        for (const f of files) {
                            const fileUrl = await Editor.Message.request('asset-db', 'query-url', path.join(jsonOutDir, f));
                            if (fileUrl) await Editor.Message.send('asset-db', 'reimport-asset', fileUrl);
                        }
                    }
                }
                // TableModel.ts
                const modelFile = path.join(modelOutDir, 'TableModel.ts');
                if (modelFile.startsWith(assetsDir)) {
                    const fileUrl = await Editor.Message.request('asset-db', 'query-url', modelFile);
                    if (fileUrl) {
                        await Editor.Message.send('asset-db', 'refresh-asset', fileUrl);
                        await Editor.Message.send('asset-db', 'reimport-asset', fileUrl);
                    }
                }
            }
        } catch (e: any) {
            console.warn('[excel-tool] 刷新资源失败:', e?.message || e);
        }

        return true;
    },
};

export async function load() {
    console.log(`load ${name}`);
}

export function unload() {
    console.log(`unload ${name}`);
}