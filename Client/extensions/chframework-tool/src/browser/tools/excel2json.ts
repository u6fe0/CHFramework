import path from 'path';
import { promises as fs, constants as FS } from 'fs';
import * as XLSX from 'xlsx';

type Row = any[];

function toNumber(v: any): number {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  const f = Number(String(v).trim());
  return Number.isFinite(f) ? f : 0;
}
function castValue(v: any, t: string): any {
  const type = (t || '').trim().toLowerCase();
  if (type === 'number') return toNumber(v);
  return v === null || v === undefined ? '' : String(v);
}

function readSheet(rows: Row[]): any[] {
  if (!rows || rows.length < 3) return [];
  const typeRow = (rows[1] || []).map(x => (x == null ? '' : String(x).trim().toLowerCase()));
  const keyRow  = (rows[2] || []).map(x => (x == null ? '' : String(x).trim()));
  const idIdx = keyRow.findIndex(k => k.toLowerCase() === 'id');
  if (idIdx < 0) return [];

  const out: any[] = [];
  for (let r = 3; r < rows.length; r++) {
    const row = rows[r] || [];
    const rawId = row[idIdx];
    if (rawId == null || String(rawId).trim() === '') continue;
    const obj: any = {};
    for (let i = 0; i < keyRow.length; i++) {
      const key = keyRow[i];
      if (!key) continue;
      obj[key] = castValue(row[i], typeRow[i] || 'string');
    }
    out.push(obj);
  }
  return out;
}

async function readWorkbookFromFile(file: string): Promise<XLSX.WorkBook> {
  // 先检测可读
  await fs.access(file, FS.R_OK);
  const buf = await fs.readFile(file);
  return XLSX.read(buf, { type: 'buffer', cellDates: false });
}

/**
 * 将 excelDir 下的 .xlsx 转换到 jsonOutDir
 */
export async function convertExcelDir(excelDir: string, jsonOutDir: string, options?: { compact?: boolean }) {
  const compact = options?.compact !== false;
  const files = (await fs.readdir(excelDir))
    .filter(f => f.toLowerCase().endsWith('.xlsx') && !f.startsWith('~$'));

  await fs.mkdir(jsonOutDir, { recursive: true });

  const written: string[] = [];
  for (const f of files) {
    const full = path.join(excelDir, f);
    try {
      const wb = await readWorkbookFromFile(full);
      const ws = wb.Sheets[wb.SheetNames[0]];
      if (!ws) { console.warn(`[excel2json] 无工作表: ${f}`); continue; }

      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true }) as Row[];
      const data = readSheet(rows);
      if (!data.length) { console.warn(`[excel2json] 跳过（无数据或缺少 id）: ${f}`); continue; }

      const outPath = path.join(jsonOutDir, `${path.parse(f).name}.json`);
      const json = compact ? JSON.stringify(data) : JSON.stringify(data, null, 2);
      await fs.writeFile(outPath, json, 'utf8');
      console.log(`[excel2json] 生成: ${outPath}`);
      written.push(outPath);
    } catch (e: any) {
      console.warn(`[excel2json] 跳过，无法读取文件: ${full} -> ${e?.message || e}`);
      continue;
    }
  }
  return written;
}