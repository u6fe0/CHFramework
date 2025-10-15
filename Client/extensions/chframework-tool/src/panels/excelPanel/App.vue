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

// 面板加载时，从 Editor.Profile 读取历史配置
onMounted(async () => {
  const keys: Keys[] = ['excelDir', 'jsonOutDir', 'modelOutDir', 'FrameworkTS'];
  for (const k of keys) {
    const v = await Editor.Profile.getConfig('Excel_Convert_Tool', k);
    if (typeof v === 'string' && v) {
      form[k] = v;
    }
  }
});

async function pickDir(key: Keys) {
  const path = form[key] || (Editor.Project && (Editor.Project as any).path) || '';
  const result = await Editor.Dialog.select({
      title: '选择目录',
      path,
      type: 'directory',
      multi: false,
  });
  if (result.canceled) {
    message({ message: '已取消选择' });
    return;
  }
  if (result.filePaths && result.filePaths[0]) {
    await Editor.Profile.setConfig('Excel_Convert_Tool', key, result.filePaths[0]);
    form[key] = result.filePaths[0];
  }
}

async function pickFrameworkTS() {
  const path = form.FrameworkTS || (Editor.Project && (Editor.Project as any).path) || '';
  const result = await Editor.Dialog.select({
      title: '选择目录',
      path,
      type: 'file',
      filters: [{ name: 'TypeScript', extensions: ['ts'] }],
      multi: false,
  });
  if (result.canceled) {
    message({ message: '已取消选择' });
    return;
  }
  if (result.filePaths && result.filePaths[0]) {
    await Editor.Profile.setConfig('Excel_Convert_Tool', 'FrameworkTS', result.filePaths[0]);
    form.FrameworkTS = result.filePaths[0];
  }
}

async function onConvert() {
  if (!form.excelDir || !form.jsonOutDir || !form.modelOutDir || !form.FrameworkTS) {
    message({ type: 'warning', message: '请先选择四个目录' });
    return;
  }
  converting.value = true;
  try {
    const ok = await Editor.Message.request(name, 'convert-excel', {
      excelDir: form.excelDir,
      jsonOutDir: form.jsonOutDir,
      modelOutDir: form.modelOutDir,
      FrameworkTS: form.FrameworkTS
    });
    if (ok) message({ type: 'success', message: '转换完成' });
    else message({ type: 'error', message: '转换失败，请查看控制台日志' });
  } catch (e:any) {
    message({ type: 'error', message: `转换异常: ${e?.message || e}` });
  } finally {
    converting.value = false;
  }
}
</script>

<template>
  <el-card header="Excel 工具" shadow="hover">
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
          开始转换
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>