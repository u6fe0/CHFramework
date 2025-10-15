import { AssetInfo } from "@cocos/creator-types/editor/packages/asset-db/@types/public";
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const PLACEHOLDER_PREFIX = 'XXX';

async function promptViewName(): Promise<string | null> {
  return new Promise((resolve) => {
    // 创建一个 HTML 输入对话框
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: #2d2d30;
      color: #cccccc;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      min-width: 300px;
    `;    const title = document.createElement('h3');
    title.textContent = '创建 MVVM';
    title.style.cssText = 'margin: 0 0 15px 0; color: #ffffff;';

    const label = document.createElement('label');
    label.textContent = '请输入 View 前缀（如：User，将生成 UserView）:';
    label.style.cssText = 'display: block; margin-bottom: 8px; font-size: 13px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = 'User';
    input.placeholder = 'User';
    input.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #3c3c3c;
      background: #1e1e1e;
      color: #cccccc;
      border-radius: 3px;
      font-size: 13px;
      box-sizing: border-box;
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 15px; text-align: right;';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
      padding: 6px 12px;
      margin-right: 8px;
      border: 1px solid #3c3c3c;
      background: #2d2d30;
      color: #cccccc;
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = '确定';
    okBtn.style.cssText = `
      padding: 6px 12px;
      border: 1px solid #0e639c;
      background: #0e639c;
      color: #ffffff;
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
    `;

    const cleanup = () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };

    cancelBtn.onclick = () => {
      cleanup();
      resolve(null);
    };    okBtn.onclick = () => {
      const prefix = input.value.trim();
      cleanup();
      // 自动添加 View 后缀
      resolve(prefix ? `${prefix}View` : null);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        okBtn.onclick!(e as any);
      } else if (e.key === 'Escape') {
        cancelBtn.onclick!(e as any);
      }
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cancelBtn.onclick!(e as any);
      }
    };

    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(okBtn);
    dialog.appendChild(title);
    dialog.appendChild(label);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 聚焦输入框并选中文本
    setTimeout(() => {
      input.focus();
      input.select();
    }, 50);
  });
}

function isTextFile(p: string): boolean {
  const ext = path.extname(p).toLowerCase();
  return new Set([
    '.ts', '.tsx', '.js', '.json', '.prefab', '.scene', '.txt', '.md', '.meta', '.fire', '.mtl', '.material', '.shader', '.vue', '.css'
  ]).has(ext);
}

async function walkDir(dir: string): Promise<{ files: string[]; dirs: string[] }> {
  const files: string[] = [];
  const dirs: string[] = [];
  async function rec(d: string) {
    const entries = await fs.promises.readdir(d, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) { dirs.push(full); await rec(full); }
      else files.push(full);
    }
  }
  await rec(dir);
  return { files, dirs };
}

async function replaceInFiles(files: string[], prefixFrom: string, viewName: string) {
  // 从完整的 View 名称中提取前缀（移除 View 后缀）
  const prefix = viewName.replace(/View$/, '');
  
  for (const f of files) {
    if (!isTextFile(f)) continue;
    try {
      let s = await fs.promises.readFile(f, 'utf8');
      let changed = false;
      
      // 替换所有包含 XXX 的模式
      const patterns = [
        'XXXView', 'XXXModel', 'XXXController', 'XXXComponent', 'XXXData', 
        'XXXManager', 'XXXService', 'XXXHandler', 'XXXUtil', 'XXXHelper'
      ];
      
      for (const pattern of patterns) {
        if (s.includes(pattern)) {
          const replacement = pattern.replace('XXX', prefix);
          s = s.split(pattern).join(replacement);
          changed = true;
        }
      }
      
      if (changed) {
        await fs.promises.writeFile(f, s, 'utf8');
      }
    } catch {}
  }
}

async function renamePaths(dirs: string[], files: string[], from: string, viewName: string, tempRoot: string) {
  // 从完整的 View 名称中提取前缀（移除 View 后缀）
  const prefix = viewName.replace(/View$/, '');
  
  const renameOne = async (p: string) => {
    const base = path.basename(p);
    if (!base.includes(from)) return p;
    
    // 检查文件是否存在
    if (!(await fs.promises.stat(p).catch(() => null))) {
      console.warn(`[renamePaths] 跳过不存在的路径: ${p}`);
      return p;
    }
    
    const nbase = base.split(from).join(prefix);
    const target = path.join(path.dirname(p), nbase);
    if (target === p) return p;
    
    try {
      await fs.promises.rename(p, target);
      // console.log(`[renamePaths] 重命名: ${path.relative(tempRoot, p)} -> ${path.relative(tempRoot, target)}`);
      return target;
    } catch (e) {
      console.error(`[renamePaths] 重命名失败: ${p} -> ${target}:`, (e as any)?.message || e);
      return p;
    }
  };

  // 先重命名目录（从深到浅）
  dirs.sort((a, b) => b.length - a.length);
  for (let i = 0; i < dirs.length; i++) {
    dirs[i] = await renameOne(dirs[i]);
  }

  // 重新扫描文件路径（因为目录重命名可能改变了文件路径）
  const { files: newFiles } = await walkDir(tempRoot);
  
  // 重命名文件
  for (const file of newFiles) {
    await renameOne(file);
  }
}

async function moveOut(tempRoot: string, targetDir: string) {
  const names = await fs.promises.readdir(tempRoot);
  for (const name of names) {
    const src = path.join(tempRoot, name);
    const dst = path.join(targetDir, name);
    if (fs.existsSync(dst)) throw new Error(`目标已存在: ${dst}`);
    await fs.promises.rename(src, dst);
  }
  // 注意：不在这里删除临时目录，由调用方在 finally 块中处理
}

exports.onAssetMenu = function (assetInfo: AssetInfo) {
  return [
    {
      "label": "i18n:chframework-tool.menu.mvvm_generator",
      visible: assetInfo.isDirectory,
      async click() {
        try {
          const dirUrl = assetInfo.url;
          const dirPath = await Editor.Message.request('asset-db', 'query-path', dirUrl);
          if (!dirPath) {
            console.error('[mvvm_generator] 无法获取目录路径:', dirUrl);
            return;
          }

          // 输入 View 名称
          const viewName = await promptViewName();
          if (!viewName) {
            console.warn('[mvvm_generator] 已取消创建');
            return;
          }

          const zipPath = path.resolve(__dirname, '../templates/XXXView.zip');
          if (!fs.existsSync(zipPath)) {
            console.error('[mvvm_generator] 模板包不存在:', zipPath);
            return;
          }          // 解压至临时目录
          const tempRoot = path.join(dirPath, `.__mvvm_tmp_${Date.now()}`);
          
          try {
            await fs.promises.mkdir(tempRoot, { recursive: true });
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(tempRoot, true);

            // 文本替换与重命名
            const { files, dirs } = await walkDir(tempRoot);
            await replaceInFiles(files, PLACEHOLDER_PREFIX, viewName);
            await renamePaths(dirs, files, PLACEHOLDER_PREFIX, viewName, tempRoot);

            // 移动到目标目录
            await moveOut(tempRoot, dirPath);
            console.log(`[mvvm_generator] 已创建 ${viewName} 到: ${dirPath}`);
          } finally {
            // 确保临时目录被删除
            try {
              if (fs.existsSync(tempRoot)) {
                await fs.promises.rm(tempRoot, { recursive: true, force: true });
                // console.log(`[mvvm_generator] 已清理临时目录: ${tempRoot}`);
              }
            } catch (cleanupError) {
              // console.warn(`[mvvm_generator] 清理临时目录失败: ${tempRoot}`, (cleanupError as any)?.message || cleanupError);
            }
          }

          // 刷新资源管理器
          try {
            await Editor.Message.send('asset-db', 'refresh-asset', dirUrl);
          } catch (e) {
            console.warn('[mvvm_generator] 刷新资源失败:', (e as any)?.message || e);
          }
        } catch (e) {
          console.error('[mvvm_generator] 生成失败:', (e as any)?.message || e);
        }
      },
    },
  ];
};