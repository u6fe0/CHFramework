<script setup lang="ts">
import { reactive, onMounted, inject, ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElCard } from 'element-plus';
import { name } from '../../../package.json';
import { keyMessage } from './provide-inject';

const message = inject(keyMessage)!;

type Keys = 'excelDir' | 'jsonOutDir' | 'modelOutDir' | 'FrameworkTS';
const form = reactive<Record<Keys, string>>({
  excelDir: '',
  jsonOutDir: '',
  modelOutDir: '',
  FrameworkTS: ''
});

const converting = ref(false);
const syncing = ref(false);

// 获取项目根目录
function getProjectPath(): string {
  return (Editor.Project && (Editor.Project as any).path) || '';
}

// 将绝对路径转换为相对于项目的路径
function toRelativePath(absolutePath: string): string {
  const projectPath = getProjectPath();
  if (!projectPath || !absolutePath) return absolutePath;
  
  // 使用path模块进行相对路径计算（需要动态导入）
  if (absolutePath.startsWith(projectPath)) {
    return absolutePath.substring(projectPath.length).replace(/^[\\\/]/, '');
  }
  return absolutePath;
}

// 将相对路径转换为绝对路径
function toAbsolutePath(relativePath: string): string {
  const projectPath = getProjectPath();
  if (!projectPath || !relativePath) return relativePath;
  
  // 如果已经是绝对路径，直接返回
  if (relativePath.includes(':') || relativePath.startsWith('/')) {
    return relativePath;
  }
  
  return `${projectPath}/${relativePath}`.replace(/\\/g, '/');
}

// 面板加载时，从 Editor.Profile 读取历史配置
onMounted(async () => {
  const keys: Keys[] = ['excelDir', 'jsonOutDir', 'modelOutDir', 'FrameworkTS'];
  for (const k of keys) {
    const v = await Editor.Profile.getConfig('Excel_Convert_Tool', k);
    if (typeof v === 'string' && v) {
      // 将存储的相对路径显示出来
      form[k] = v;
    }
  }
});

async function pickDir(key: Keys) {
  const absolutePath = toAbsolutePath(form[key]) || getProjectPath();
  const result = await Editor.Dialog.select({
      title: '选择目录',
      path: absolutePath,
      type: 'directory',
      multi: false,
  });
  if (result.canceled) {
    message({ message: '已取消选择' });
    return;
  }
  if (result.filePaths && result.filePaths[0]) {
    // 存储和显示相对路径
    const relativePath = toRelativePath(result.filePaths[0]);
    await Editor.Profile.setConfig('Excel_Convert_Tool', key, relativePath);
    form[key] = relativePath;
  }
}

async function pickFrameworkTS() {
  const absolutePath = toAbsolutePath(form.FrameworkTS) || getProjectPath();
  const result = await Editor.Dialog.select({
      title: '选择文件',
      path: absolutePath,
      type: 'file',
      filters: [{ name: 'TypeScript', extensions: ['ts'] }],
      multi: false,
  });
  if (result.canceled) {
    message({ message: '已取消选择' });
    return;
  }
  if (result.filePaths && result.filePaths[0]) {
    // 存储和显示相对路径
    const relativePath = toRelativePath(result.filePaths[0]);
    await Editor.Profile.setConfig('Excel_Convert_Tool', 'FrameworkTS', relativePath);
    form.FrameworkTS = relativePath;
  }
}

async function onConvert() {
  if (!form.excelDir || !form.jsonOutDir || !form.modelOutDir || !form.FrameworkTS) {
    message({ type: 'warning', message: '请先选择四个目录' });
    return;
  }
  converting.value = true;
  try {
    // 将相对路径转换为绝对路径后发送给后端
    const ok = await Editor.Message.request(name, 'convert-excel', {
      excelDir: toAbsolutePath(form.excelDir),
      jsonOutDir: toAbsolutePath(form.jsonOutDir),
      modelOutDir: toAbsolutePath(form.modelOutDir),
      FrameworkTS: toAbsolutePath(form.FrameworkTS)
    });
    if (ok) message({ type: 'success', message: '转换完成' });
    else message({ type: 'error', message: '转换失败，请查看控制台日志' });
  } catch (e:any) {
    message({ type: 'error', message: `转换异常: ${e?.message || e}` });
  } finally {
    converting.value = false;
  }
}

async function onSyncToExcel() {
  if (!form.excelDir || !form.jsonOutDir) {
    message({ type: 'warning', message: '请先选择 Excel 目录和 JSON 目录' });
    return;
  }
  syncing.value = true;
  try {
    const ok = await Editor.Message.request(name, 'sync-json-to-excel', {
      jsonDir: toAbsolutePath(form.jsonOutDir),
      excelDir: toAbsolutePath(form.excelDir)
    });
    if (ok) message({ type: 'success', message: 'JSON 同步到 Excel 完成' });
    else message({ type: 'error', message: '同步失败，请查看控制台日志' });
  } catch (e: any) {
    message({ type: 'error', message: `同步异常: ${e?.message || e}` });
  } finally {
    syncing.value = false;
  }
}
</script>

<template>
  <el-card header="Excel ⇄ JSON 双向转换" shadow="hover">
    <el-form label-width="160px">
      <el-form-item label="Excel地址">
        <el-input v-model="form.excelDir" placeholder="请选择 Excel 源目录" readonly>
          <template #append>
            <el-button type="primary" @click="pickDir('excelDir')">选择</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="JSON输出目录">
        <el-input v-model="form.jsonOutDir" placeholder="请选择 JSON 输出目录" readonly>
          <template #append>
            <el-button type="primary" @click="pickDir('jsonOutDir')">选择</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="Model输出目录">
        <el-input v-model="form.modelOutDir" placeholder="请选择 Model 输出目录" readonly>
          <template #append>
            <el-button type="primary" @click="pickDir('modelOutDir')">选择</el-button>
          </template>
        </el-input>
      </el-form-item>


      <el-form-item label="Framework.ts文件">
        <el-input v-model="form.FrameworkTS" placeholder="请选择 Framework.ts 文件" readonly>
          <template #append>
            <el-button type="primary" @click="pickFrameworkTS">选择</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label-width="0" class="center-actions">
        <el-button
          type="success"
          :loading="converting"
          :disabled="!form.excelDir || !form.jsonOutDir || !form.modelOutDir || !form.FrameworkTS"
          @click="onConvert"
        >
          Excel → JSON
        </el-button>
        <el-button
          type="warning"
          :loading="syncing"
          :disabled="!form.excelDir || !form.jsonOutDir"
          @click="onSyncToExcel"
        >
          JSON → Excel
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>