"use strict";
const index = require("./index-Dp6PGtvh.cjs");
const _package = require("./package-Bg9K7EYV.cjs");
const keyAppRoot = Symbol();
const keyMessage = Symbol();
const _sfc_main = /* @__PURE__ */ index.defineComponent({
  __name: "App",
  setup(__props) {
    const message = index.inject(keyMessage);
    const form = index.reactive({
      excelDir: "",
      jsonOutDir: "",
      modelOutDir: "",
      FrameworkTS: ""
    });
    const converting = index.ref(false);
    index.onMounted(async () => {
      const keys = ["excelDir", "jsonOutDir", "modelOutDir", "FrameworkTS"];
      for (const k of keys) {
        const v = await Editor.Profile.getConfig("Excel_Convert_Tool", k);
        if (typeof v === "string" && v) {
          form[k] = v;
        }
      }
    });
    async function pickDir(key) {
      const path = form[key] || Editor.Project && Editor.Project.path || "";
      const result = await Editor.Dialog.select({
        title: "选择目录",
        path,
        type: "directory",
        multi: false
      });
      if (result.canceled) {
        message({ message: "已取消选择" });
        return;
      }
      if (result.filePaths && result.filePaths[0]) {
        await Editor.Profile.setConfig("Excel_Convert_Tool", key, result.filePaths[0]);
        form[key] = result.filePaths[0];
      }
    }
    async function pickFrameworkTS() {
      const path = form.FrameworkTS || Editor.Project && Editor.Project.path || "";
      const result = await Editor.Dialog.select({
        title: "选择目录",
        path,
        type: "file",
        filters: [{ name: "TypeScript", extensions: ["ts"] }],
        multi: false
      });
      if (result.canceled) {
        message({ message: "已取消选择" });
        return;
      }
      if (result.filePaths && result.filePaths[0]) {
        await Editor.Profile.setConfig("Excel_Convert_Tool", "FrameworkTS", result.filePaths[0]);
        form.FrameworkTS = result.filePaths[0];
      }
    }
    async function onConvert() {
      if (!form.excelDir || !form.jsonOutDir || !form.modelOutDir || !form.FrameworkTS) {
        message({ type: "warning", message: "请先选择四个目录" });
        return;
      }
      converting.value = true;
      try {
        const ok = await Editor.Message.request(_package.name, "convert-excel", {
          excelDir: form.excelDir,
          jsonOutDir: form.jsonOutDir,
          modelOutDir: form.modelOutDir,
          FrameworkTS: form.FrameworkTS
        });
        if (ok) message({ type: "success", message: "转换完成" });
        else message({ type: "error", message: "转换失败，请查看控制台日志" });
      } catch (e) {
        message({ type: "error", message: `转换异常: ${(e == null ? void 0 : e.message) || e}` });
      } finally {
        converting.value = false;
      }
    }
    return (_ctx, _cache) => {
      return index.openBlock(), index.createBlock(index.unref(index.ElCard), {
        header: "Excel 工具",
        shadow: "hover"
      }, {
        default: index.withCtx(() => [
          index.createVNode(index.unref(index.ElForm), { "label-width": "160px" }, {
            default: index.withCtx(() => [
              index.createVNode(index.unref(index.ElFormItem), { label: "Excel地址" }, {
                default: index.withCtx(() => [
                  index.createVNode(index.unref(index.ElInput), {
                    modelValue: form.excelDir,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.excelDir = $event),
                    placeholder: "请选择 Excel 源目录",
                    readonly: ""
                  }, {
                    append: index.withCtx(() => [
                      index.createVNode(index.unref(index.ElButton), {
                        type: "primary",
                        onClick: _cache[0] || (_cache[0] = ($event) => pickDir("excelDir"))
                      }, {
                        default: index.withCtx(() => [..._cache[7] || (_cache[7] = [
                          index.createTextVNode("选择", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              index.createVNode(index.unref(index.ElFormItem), { label: "JSON输出目录" }, {
                default: index.withCtx(() => [
                  index.createVNode(index.unref(index.ElInput), {
                    modelValue: form.jsonOutDir,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.jsonOutDir = $event),
                    placeholder: "请选择 JSON 输出目录",
                    readonly: ""
                  }, {
                    append: index.withCtx(() => [
                      index.createVNode(index.unref(index.ElButton), {
                        type: "primary",
                        onClick: _cache[2] || (_cache[2] = ($event) => pickDir("jsonOutDir"))
                      }, {
                        default: index.withCtx(() => [..._cache[8] || (_cache[8] = [
                          index.createTextVNode("选择", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              index.createVNode(index.unref(index.ElFormItem), { label: "Model输出目录" }, {
                default: index.withCtx(() => [
                  index.createVNode(index.unref(index.ElInput), {
                    modelValue: form.modelOutDir,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.modelOutDir = $event),
                    placeholder: "请选择 Model 输出目录",
                    readonly: ""
                  }, {
                    append: index.withCtx(() => [
                      index.createVNode(index.unref(index.ElButton), {
                        type: "primary",
                        onClick: _cache[4] || (_cache[4] = ($event) => pickDir("modelOutDir"))
                      }, {
                        default: index.withCtx(() => [..._cache[9] || (_cache[9] = [
                          index.createTextVNode("选择", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              index.createVNode(index.unref(index.ElFormItem), { label: "Framework.ts文件" }, {
                default: index.withCtx(() => [
                  index.createVNode(index.unref(index.ElInput), {
                    modelValue: form.FrameworkTS,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.FrameworkTS = $event),
                    placeholder: "请选择 Framework.ts 文件",
                    readonly: ""
                  }, {
                    append: index.withCtx(() => [
                      index.createVNode(index.unref(index.ElButton), {
                        type: "primary",
                        onClick: pickFrameworkTS
                      }, {
                        default: index.withCtx(() => [..._cache[10] || (_cache[10] = [
                          index.createTextVNode("选择", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"])
                ]),
                _: 1
              }),
              index.createVNode(index.unref(index.ElFormItem), {
                "label-width": 0,
                class: "center-actions"
              }, {
                default: index.withCtx(() => [
                  index.createVNode(index.unref(index.ElButton), {
                    type: "success",
                    loading: converting.value,
                    disabled: !form.excelDir || !form.jsonOutDir || !form.modelOutDir || !form.FrameworkTS,
                    onClick: onConvert
                  }, {
                    default: index.withCtx(() => [..._cache[11] || (_cache[11] = [
                      index.createTextVNode(" 开始转换 ", -1)
                    ])]),
                    _: 1
                  }, 8, ["loading", "disabled"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const state = index.reactive({
  a: 1
});
const weakMap = /* @__PURE__ */ new WeakMap();
const mvvmPanel = Editor.Panel.define({
  template: '<div id="app" class="dark"></div>',
  // 只留一个 div 用于 vue 的挂载
  $: {
    root: "#app"
  },
  ready() {
    if (!this.$.root) return;
    const app = index.createApp(_sfc_main);
    app.provide(keyAppRoot, this.$.root);
    app.provide(keyMessage, (options = {}) => {
      if (typeof options === "string") {
        options = { message: options };
      }
      options.appendTo ?? (options.appendTo = this.$.root);
      return index.ElMessage(options);
    });
    app.mount(this.$.root);
    weakMap.set(this, app);
  },
  close() {
    var _a;
    const app = weakMap.get(this);
    (_a = app == null ? void 0 : app.unmount) == null ? void 0 : _a.call(app);
  },
  methods: {
    increase() {
      state.a += 1;
    }
  }
});
module.exports = mvvmPanel;
