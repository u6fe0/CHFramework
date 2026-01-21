import path from 'path';
import { promises as fs, constants as FS } from 'fs';
import { execSync } from 'child_process';

/**
 * 读取指定目录下的所有 .proto 文件
 */
async function readProtoFiles(protoDir: string): Promise<string[]> {
    await fs.access(protoDir, FS.R_OK);
    const files = await fs.readdir(protoDir);
    return files
        .filter(f => f.toLowerCase().endsWith('.proto') && !f.startsWith('~$'))
        .map(f => path.join(protoDir, f))
        .sort((a, b) => path.parse(a).name.localeCompare(path.parse(b).name, 'en', { sensitivity: 'base' }));
}

/**
 * 将单个 proto 文件转换为 TypeScript
 */
async function convertProtoToTs(protoPath: string, outDir: string, options?: { keepJs?: boolean }): Promise<string> {
    const basename: string = path.basename(protoPath, '.proto');
    const outTs: string = path.join(outDir, `${basename}.ts`);

    try {
        // 直接生成 .ts 文件
        const cmd = `npx pbjs --ts "${outTs}" "${protoPath}"`;
        try {
            execSync(cmd, { encoding: 'utf8' });
        } catch (e: any) {
            const stderr = e.stderr || e.stdout || e.message || '';
            throw new Error(`pbjs 失败: ${stderr}`);
        }
        
        return outTs;
    } catch (e: any) {
        throw new Error(`${e?.message || e}`);
    }
}

/**
 * 批量将 proto 文件转换为 TypeScript 类型定义文件
 * @param protoDir proto 文件所在目录
 * @param outDir 输出目录
 * @param options 可选配置
 * @returns 返回生成的文件列表和数量
 */
export async function generateProtoTypes(
    protoDir: string,
    outDir: string,
    options?: { keepJs?: boolean }
): Promise<{ outDir: string; files: string[]; count: number }> {
    // 读取所有 proto 文件
    const protoFiles = await readProtoFiles(protoDir);
    
    if (!protoFiles.length) {
        console.warn('[proto2ts] 未找到 proto 文件');
        return { outDir, files: [], count: 0 };
    }

    // 创建输出目录
    await fs.mkdir(outDir, { recursive: true });

    const generatedFiles: string[] = [];
    const errors: string[] = [];    // 逐个处理 proto 文件
    for (const protoFile of protoFiles) {
        try {
            console.log(`[proto2ts] 正在处理 ${path.basename(protoFile)} ...`);
            const outFile = await convertProtoToTs(protoFile, outDir, options);
            generatedFiles.push(outFile);
            console.log(`[proto2ts] ✓ 成功生成 ${path.basename(outFile)}`);
        } catch (e: any) {
            const errMsg = e?.message || e;
            console.error(`[proto2ts] ✗ ${path.basename(protoFile)} 失败:`);
            console.error(`  ${errMsg}`);
            errors.push(`${path.basename(protoFile)}: ${errMsg}`);
        }
    }

    if (errors.length > 0) {
        console.warn(`[proto2ts] 完成，但有 ${errors.length} 个文件失败`);
    } else {
        console.log(`[proto2ts] 生成完成: ${outDir} (${generatedFiles.length} 个文件)`);
    }

    return { outDir, files: generatedFiles, count: generatedFiles.length };
}
