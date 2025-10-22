# CHFramework

## 简介

CHFramework 是一个专为 Cocos Creator 引擎设计的轻量级 MVVM (Model-View-ViewModel) 框架。
通过引入数据绑定、命令模式、UI管理、网络服务、数据表服务以及编辑器扩展工具等一系列功能，可快速构建结构清晰、可维护性高、易于扩展的项目。

## 核心功能

- **MVVM 架构**: 将视图（View）、视图模型（ViewModel）和模型（Model）分离，降低代码耦合度。
- **数据绑定**: 实现了视图与数据的自动同步，无需手动更新UI。
- **命令模式**: 将请求封装成对象，解耦事件的发送者和接收者。
- **UI 管理**: 提供强大的 UI 视图管理服务，支持 UI 分层、加载、缓存、遮罩和生命周期管理。
- **数据表服务**: 方便地读取和管理游戏配置数据。
- **编辑器扩展**: 内置 Excel 工具面板，一键将 Excel 表格转换为 JSON 与 TypeScript 模型定义。

## 模块详解

### 1. 数据绑定 (Data Binding)

数据绑定是框架的核心功能之一，它允许视图自动响应数据的变化。

- **`Observable`**: 可观察属性类。使用它来包装你的数据，当数据改变时，它会自动通知所有订阅者。
- **`Binder`**: 绑定器。用于在视图和视图模型之间建立绑定关系（单向 / 双向）。
- **UI Adapters**: 框架内置了多种 UI 适配器：
  - `LabelAdapter`: 用于 `Label`（始终返回 `string`）
  - `EditBoxAdapter`: 用于 `EditBox`（双向输入）
  - `SliderAdapter`: 用于 `Slider`（数值绑定）
  - `ToggleAdapter`: 用于 `Toggle`（布尔绑定）
  - `LabelNumberAdapter`: 专门用于 Label 显示数值并返回 `number` 类型
  - `……`
- 示例：图中 “想要的新昵称”，会随着输入框的内容变化时自动更新，仅需下面一行绑定代码。
``` TypeScript
    Binder.bindTwoWay(this.vm.nextNickName, new EditBoxAdapter(this.nameEditBox));
```
 ![](Docs/Images/rename.gif)


### 2. 命令模式 (Command Pattern)

命令模式用于处理用户输入和系统事件，例如按钮点击。

- **`CommandBase`**: 所有命令的基类。
- **`SimpleCommand`**: 用于执行同步操作的简单命令。
- **`AsyncCommand`**: 用于执行异步操作（如网络请求、动画播放）的命令，支持 `canExecute()` 条件控制与 `canExecuteChanged()` 回调。

### 3. UI 管理 (UI Management)

`ViewService` 是一个强大的 UI 管理器，它简化了 UI 的创建和流程控制。

- **`ViewService`**: 负责 UI 视图的加载、显示、隐藏、销毁和链式操作（串行化打开）。
- **`ViewBase`**: 所有 UI 视图的基类，包含生命周期钩子（`onCreate` / `onShown` / `onHide` / `onDismiss`）。
- **`ViewModelBase`**: 视图模型的基类，负责处理视图的业务逻辑和状态。
- **`UILayers`**: 支持 UI 分层管理（`ViewType.Normal` / `ViewType.Popup` / `ViewType.Toast`），可轻松控制不同 UI 界面的显示层级与遮罩。
- **遮罩与 Loading**:
  - `ViewMask`: 在打开弹窗时自动插入背景遮罩，支持点击关闭。
  - `ViewLoadingUIBase`: 自定义 Loading 界面基类，可在 `openUI` 时显示加载进度。

### 4. 数据表服务 (Table Service)

用于加载和查询游戏配置数据。

- **`TableReaderService`**: 数据表读取服务，支持通过键（通常是 `id`）快速查询。
- **`ITableModel`**: 数据表模型的接口，所有数据表结构都需要实现此接口。

**工作流程**:
1. 在 `Excels` 目录下编辑 Excel 表格（第1行注释、第2行类型、第3行字段名、第4行起为数据）。
2. 通过编辑器扩展工具一键转换为 JSON 与 TypeScript 模型定义。
3. 读取表格数据：

``` TypeScript
// Item 表格读取演示
const items = await Context.getService(TableReaderService).read<IItem>("Item");
items.forEach(item => {
    this.tableInfoLb.string += `${item.id} ${item.title} ${item.type} ${item.quality} ${item.desc}\n`;
});
```

### 5. 插件

框架提供了名为 **Excel 工具** 的插件，用于快速将 Excel 表格转换为项目可用的 JSON 数据与 TypeScript 模型定义。

**功能**:
- 选择 Excel 源目录、JSON 输出目录、Model 输出目录
- 一键执行转换（支持 `.xlsx` 格式）

**生成内容**:
- JSON 文件: 存放于指定的 JSON 输出目录，可被 `TableReaderService` 读取
- TableModel.ts: 存放于指定的 Model 输出目录，包含所有表格的接口定义（如 `IHero` / `IItem`），继承自 `ITableModel`

**打开方式**:
在 Cocos Creator 菜单栏中选择 **CHFramework工具 > Excel 转换工具** 即可打开面板。

## 项目展示

 ![](Docs/Images/demo.gif)

## 自定义扩展
CHFramework 支持多种自定义扩展方式，让开发者能够根据项目需求定制框架行为：
- UI 动画与过渡效果：框架支持自定义 UI 界面的打开/关闭动画。
- Loading 界面：可通过继承 ViewLoadingUIBase 实现自定义加载过渡界面。
- Toast 提示组件：可自定义 Toast 样式与动画效果，通过继承 ToastBase 实现。
- 自定义 UI 适配器：框架允许扩展更多 UI 适配器，满足特殊组件的绑定需求。
- 自定义数据表读取服务：支持 JsonReader 外的自定义格式读取器。
## 项目结构

```
CHFramework/
├─ Client/
│  ├─ assets/                    
│  │  ├─ resources/
│  │  │  └─ Demo_CHFramework/
│  │  │     ├─ Audio/                # 音频资源
│  │  │     ├─ Prefab/               # UI 预制体
│  │  │     └─ Table/                # 转换后的 JSON 配置数据
│  │  └─ Scripts/
│  │     ├─ CHFramework/             # 框架核心代码
│  │     │  └─ Runtime/              # 核心模块
│  │     └─ Demo_CHFramework/        # 示例工程
│  │        ├─ Constant/             # 常量定义
│  │        ├─ Services/             # 业务服务
│  │        ├─ TableModel/           # 自动生成的数据表模型定义
│  │        └─ UI/                   # UI 基础组件
│  │           ├─ Toast/             # 飘窗-可自定义
│  │           └─ UILoading/         # 加载过渡界面-可自定义
│  └─ extensions/
│     └─ chframework-tool/           # 编辑器扩展工具
└─ Excels/                           # Excel 配置表源文件
```

## 框架视频教学
[CHFramework 框架教学视频：概览](https://www.bilibili.com/video/BV1tCs4zNEDf/)

[CHFramework 框架教学视频：表格](https://www.bilibili.com/video/BV1ySs4zcEmY/)

[CHFramework 框架教学视频：快捷创建MVVM](https://www.bilibili.com/video/BV1Fks8zYEST/)

[CHFramework 框架教学视频：组件绑定](https://www.bilibili.com/video/BV1J1s8zhEvX/)

[CHFramework 框架教学视频：音频播放](https://www.bilibili.com/video/BV1LVs8zpE7U/)

[CHFramework 框架教学视频：网络请求](https://www.bilibili.com/video/BV1ENs8zZEDY/)

[CHFramework 框架教学视频：命令封装](https://www.bilibili.com/video/BV1BTs8z4ErF/)

[CHFramework 框架教学视频：自定义](https://www.bilibili.com/video/BV1a7s8zSEdt/)
## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过 GitHub Issues 或邮件联系。