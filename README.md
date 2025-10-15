# CHFramework

## 简介

CHFramework 是一个专为 Cocos Creator 引擎设计的轻量级 MVVM (Model-View-ViewModel) 框架。它通过引入数据绑定、命令模式、UI管理、网络服务、数据表服务、Toast 提示以及编辑器扩展工具等一系列功能，旨在帮助开发者构建结构清晰、可维护性高、易于扩展的项目。

## 核心功能

- **MVVM 架构**: 将视图（View）、视图模型（ViewModel）和模型（Model）分离，降低代码耦合度。
- **数据绑定**: 实现了视图与数据的自动同步，无需手动更新UI。
- **命令模式**: 将请求封装成对象，解耦事件的发送者和接收者。
- **UI 管理**: 提供强大的 UI 视图管理服务，支持 UI 分层、加载、缓存、遮罩和生命周期管理。
- **网络服务**: 集成了通用的 HTTP 网络请求服务，支持微信小游戏与 Web 双平台适配器。
- **数据表服务**: 方便地读取和管理游戏配置数据（支持 JSON、CSV 等格式）。
- **Toast 提示**: 提供全局 Toast 弹窗服务，支持队列化显示与自定义样式。
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

> **提示**: 若需绑定数值到 Label，可用 `LabelAdapter` 配合手动转换，或直接使用 `LabelNumberAdapter`。

### 2. 命令模式 (Command Pattern)

命令模式用于处理用户输入和系统事件，例如按钮点击。

- **`CommandBase`**: 所有命令的基类。
- **`SimpleCommand`**: 用于执行同步操作的简单命令。
- **`AsyncCommand`**: 用于执行异步操作（如网络请求、动画播放）的命令，支持 `canExecute()` 条件控制与 `canExecuteChanged()` 回调。

### 3. UI 管理 (UI Management)

`ViewService` 是一个强大的 UI 管理器，它简化了 UI 的创建和流程控制。

- **`ViewService`**: 负责 UI 视图的加载、显示、隐藏、销毁和链式操作（串行化打开）。
- **`UIView`**: 所有 UI 视图的基类，包含生命周期钩子（`onCreate` / `onShown` / `onHide` / `onDismiss`）。
- **`ViewModelBase`**: 视图模型的基类，负责处理视图的业务逻辑和状态。
- **`UILayers`**: 支持 UI 分层管理（`ViewType.Normal` / `ViewType.Popup` / `ViewType.Toast`），可轻松控制不同 UI 界面的显示层级与遮罩。
- **`UIKey`**: 每个 UI 视图的唯一标识，用于 `openUI` / `closeUI` / `getView` 等操作。
- **遮罩与 Loading**:
  - `ViewMask`: 在打开弹窗时自动插入背景遮罩，支持点击关闭。
  - `ViewLoadingUIBase`: 自定义 Loading 界面基类，可在 `openUI` 时显示加载进度。

### 4. 网络服务 (Networking)

框架提供了 `HttpService` 来处理与服务器的通信。

- **`HttpService`**: 封装了 HTTP GET 和 POST 请求，支持不同数据格式（`json` / `text` / `arraybuffer`）。
- **平台适配器**:
  - `XhrRequestAdapter`: 用于浏览器与原生平台（基于 `XMLHttpRequest`）
  - `WxRequestAdapter`: 用于微信小游戏（基于 `wx.request`）
- **接口定义**:
  - `IHttpRequestConfig`: 请求配置接口
  - `IHttpResponse<T>`: 成功响应接口
  - `IHttpError`: 失败响应接口

> **注意**: `HttpService` 在初始化时会根据当前平台自动选择合适的适配器；也可手动指定 `adapter` 参数。

### 5. 数据表服务 (Table Service)

用于加载和查询游戏配置数据。

- **`TableReaderService`**: 数据表读取服务，支持通过键（通常是 `id`）快速查询。
- **`JsonReader`**: 内置了对 JSON 格式数据文件的读取支持。
- **`ITableModel`**: 数据表模型的接口，所有数据表结构都需要实现此接口（通常包含一个 `id` 字段）。

**工作流程**:
1. 在 `assets/Excels` 目录下编辑 Excel 表格（第1行注释、第2行类型、第3行字段名、第4行起为数据）。
2. 通过编辑器扩展工具一键转换为 JSON 与 TypeScript 模型定义。
3. 在代码中通过 `TableReaderService.getTable<T>(tableName, JsonReader)` 加载表格，并用 `getEntry(id)` 查询数据。

### 6. Toast 提示服务 (Toast Service)

`ToastService` 提供全局的非模态提示功能，常用于操作反馈、错误提示等场景。

- **自动队列**: 多个 Toast 会自动排队依次显示，避免重叠。
- **自定义预制体**: 继承 `ToastBase` 并实现 `init` / `tick` / `isEnd` 方法即可自定义样式与动画。
- **生命周期管理**: Toast 会在播放完毕后自动销毁并从队列移除。
- **场景切换适配**: 当场景切换时，ToastService 会自动重新挂载到新场景的 Canvas 下。

**使用示例**:
```typescript
Context.getService(ToastService).showToast({ message: '操作成功！' });
```

### 7. 编辑器扩展工具 (Editor Extension)

框架提供了名为 **Excel 工具** 的编辑器扩展面板，用于快速将 Excel 表格转换为项目可用的 JSON 数据与 TypeScript 模型定义。

**功能**:
- 选择 Excel 源目录、JSON 输出目录、Model 输出目录
- 一键执行转换（支持 `.xlsx` 格式）
- 自动刷新 Cocos Creator 资源库
- 历史路径持久化（基于 `Editor.Profile`）

**转换规则**:
- 第1行: 注释（可选，将作为字段说明）
- 第2行: 类型（`number` / `string`）
- 第3行: 字段名（必须包含 `id` 字段）
- 第4行起: 数据行

**生成内容**:
- JSON 文件: 存放于指定的 JSON 输出目录，可被 `TableReaderService` 读取
- TableModel.ts: 存放于指定的 Model 输出目录，包含所有表格的接口定义（如 `IHero` / `IItem`），继承自 `ITableModel`

**打开方式**:
在 Cocos Creator 菜单栏中选择 **CHFramework工具 > Excel 转换工具** 即可打开面板。

## 如何使用

以下将直接使用项目中已实现的 `RenameView` 作为示例，它完整地展示了框架各项核心功能的实际应用。

### 1. 创建 ViewModel (`RenameViewModel.ts`)

ViewModel 是视图的"大脑"，负责处理所有业务逻辑。

- **命令封装**: 使用 `AsyncCommand` 封装复杂的异步操作（如模拟网络请求的改名流程），并将业务逻辑（如检查昵称、扣除改名卡）和可执行条件（`canRename`）包含在内。
- **服务调用**: 通过 `Context.getService(...)` 获取全局服务，如 `ToastService` 用于提示，`PlayerPrefService` 用于数据持久化。
- **事件派发**: 通过 `EventTrigger.dispatch(...)` 派发全局事件，通知其他模块（如 `GameEvent.ReNameSuccess`）。

```typescript
// assets/Scripts/Demo_CHFramework/UI/View/RenameView/RenameViewModel.ts
@BindModel(RenameModel)
export class RenameViewModel extends ViewModelBase<RenameModel> {
    // 供 View 绑定的可观察属性
    get nickName() { return this.model.nickName }
    get renameCnt() { return this.model.renameCnt }
    get nextNickName() { return this.model.nextNickName }
    // 命令-改名
    readonly renameCmd: AsyncCommand;

    constructor() {
        super();
        // 1. 创建命令，将执行逻辑和条件判断委托给 Model
        this.renameCmd = new AsyncCommand(this.rename.bind(this), () => {
            return this.canRename(this.nextNickName.value) === null;
        });
        // 2. 监听相关属性变化，触发命令状态更新
        this.nickName.on(this.renameCmd.raiseExecuteStateChanged);
        this.renameCnt.on(this.renameCmd.raiseExecuteStateChanged);
        this.nextNickName.on(this.renameCmd.raiseExecuteStateChanged);
    }
    /**
     * 执行改名。
     * ViewModel 在这里扮演“协调者”的角色。
     */
    async rename(): Promise<boolean> {
        // 委托给 Model 进行业务校验
        const error = this.canRename(this.nextNickName.value);
        if (error) {
            Context.getService(ToastService).showToast({ message: error });
            return false;
        }
        // UI 反馈：显示加载提示
        Context.getService(ToastService).showToast({ message: "正在改名，请稍候...模拟请求中" });
        await GameUtil.waitFrames(100); // 模拟异步
        // 委托给 Model 执行核心业务操作
        this.model.performRename(this.nextNickName.value);
        // UI 反馈：弹窗、音效、全局事件等
        const richTextContent = `恭喜你，成功将昵称改为<color=#00ff00>${this.nextNickName.value}</color>！`;
        Context.getService(ViewService).openUI(ViewKeys.DialogView, { title: '改名成功', content: richTextContent });
        Context.getService(AudioService).playOneShot("success");
        EventTrigger.dispatch(GameEvent.ReNameSuccess, { newName: this.nextNickName.value });

        return true;
    }
    /**
     * 检查是否可以改名
     * @param newName 要修改的新昵称
     * @returns 错误信息，如果返回 null 则表示可以改名
     */
    public canRename(newName: string): string | null {
        if (!newName || newName.trim().length === 0) {
            return "改名失败：昵称不能为空!";
        }
        if (this.nickName.value === newName) {
            return "改名失败：新昵称不能与当前昵称相同!";
        }
        if (this.renameCnt.value <= 0) {
            return "改名失败：缺少改名卡!";
        }
        return null;
    }
    /**
     * 增加改名卡
     */
    addRenameCard() {
        console.log('增加改名卡');
        this.model.addRenameCard();
    }
}
```

### 2. 创建 View (`RenameView.ts`)

View 层负责UI的展示和用户输入的响应，它通过数据绑定和命令绑定与 ViewModel 通信，自身不包含业务逻辑。

- **`@BindViewModel`**: 使用此装饰器将 View 与对应的 ViewModel 关联起来。
- **`Binder.bind`**: 实现单向数据绑定，将 ViewModel 中的 `Observable` 数据（如 `nickName`）绑定到 UI 组件（如 `Label`）的属性上。当数据变化时，UI 自动更新。
- **`Binder.bindTwoWay`**: 实现双向数据绑定，将 `EditBox` 的输入内容与 ViewModel 的 `nextNickName` 属性同步。
- **命令绑定**: 将 `Button` 的点击事件与 ViewModel 中的 `renameCmd.execute()` 关联。同时，根据 `renameCmd.canExecute()` 的结果动态更新按钮的可交互状态。
- **事件监听**: 通过 `EventTrigger.on(...)` 监听全局事件，响应来自其他模块的通知。

```typescript
// assets/Scripts/Demo_CHFramework/UI/View/RenameView/RenameView.ts

export class RenameView extends ViewBase<RenameViewModel> {
    // 组件定义-省略……
    /**
     * 视图创建时调用
     */
    onCreate() {
        // 绑定 ViewModel 和 UI 组件：
        // 单向绑定 name 到 nameLabel
        Binder.bind(this.vm.nickName, new LabelAdapter(this.nickNameLb));
        // 单向绑定 nextNickName 到 nextNickNameLb
        Binder.bind(this.vm.nextNickName, new LabelAdapter(this.nextNickNameLb));
        // 单向绑定 renameCnt 到 renameCntLb
        Binder.bind(this.vm.renameCnt, new LabelAdapter(this.renameCntLb));
        // 双向绑定 name 到 nameEditBox，当 nameEditBox 内容变化时会更新到 vm.nextNickName
        Binder.bindTwoWay(this.vm.nextNickName, new EditBoxAdapter(this.nameEditBox));

        this.vm.renameCmd.onExecuteStateChanged(() => {
            this.renameBtn.interactable = this.vm.renameCmd.canExecute();
        });
        // 按钮点击事件：
        // 1.改名按钮点击
        this.renameBtn.node.on(Button.EventType.CLICK, async () => {
            const result = await this.vm.renameCmd.execute();
        }, this);
        // 2.增加改名卡按钮点击
        this.addBtn.node.on(Button.EventType.CLICK, () => {
            this.vm.addRenameCard();
        }, this);
        // 3.关闭按钮点击
        this.closeBtn.node.on(Button.EventType.CLICK, () => {
            Context.getService(ViewService).closeUI(ViewKeys.RenameView);
        }, this);
        // 事件示例：
        // 1.可选：可监听 ViewModel 属性变化
        this.vm.addPropertyChangedListener((propName: string, value: any) => {
            console.log(`Property ${propName} changed to ${value}`);
        });
        // 2.可选：可订阅全局事件
        EventTrigger.on(GameEvent.ReNameSuccess, this.onReNameSuccess, this);
        // 打印传递的参数
        console.log('RenameView created with param:', this.param);
    }
    /**
     * 改名事件监听
     * @param param 
     */
    private onReNameSuccess(param: any) {
        console.log('收到改名成功事件，新的昵称是:', param.newName);
    }
}
```
### 3. 创建 Model (`RenameModel.ts`)
### 4. 打开视图

在需要的地方，通过 `ViewService` 打开 `RenameView`。

```typescript
Context.getService(ViewService).openUI(ViewKeys.RenameView);
```

这个 `RenameView` 的例子全面地展示了如何利用 `CHFramework` 的核心功能来构建一个功能完备、逻辑清晰、易于维护的 UI 模块。当视图运行时：
- UI 元素（如昵称、改名卡数量）的状态会通过**单向绑定**自动从 `ViewModel` 更新。
- `EditBox` 的输入会通过**双向绑定**实时同步到 `ViewModel` 的 `nextNickName` 属性。
- "改名"按钮的可交互状态会根据 `renameCmd` 的 `canExecute` 条件动态变化。
- 点击按钮会执行 `ViewModel` 中定义的**异步命令**，完成一系列复杂的业务逻辑（包含 Toast 提示、数据持久化、全局事件派发），而 `View` 本身保持简洁。
- 整个流程展示了清晰的关注点分离，是 `CHFramework` 推荐的最佳实践。

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

## 最佳实践

1. **单一职责**: View 仅负责展示，ViewModel 负责逻辑与状态，Model 负责数据结构。
2. **数据驱动**: 优先使用 `Observable` + `Binder` 实现数据与 UI 的自动同步，减少手动更新代码。
3. **命令封装**: 将复杂的异步操作封装为 `AsyncCommand`，集中管理可执行条件与业务逻辑。
4. **服务注册**: 在启动时通过 `Context.register(...)` 注册全局服务（如 `ViewService` / `TableReaderService`），统一管理依赖。
5. **配置表管理**: 使用 Excel 工具自动化生成 JSON 与 TypeScript 定义，避免手写配置表结构。
6. **事件解耦**: 使用 `EventTrigger` 派发与监听全局事件，降低模块间的直接依赖。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过 GitHub Issues 或邮件联系。
