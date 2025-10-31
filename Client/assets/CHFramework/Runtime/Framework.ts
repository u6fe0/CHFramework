/**
 * CHFramework
 * A lightweight MVVM framework for Cocos Creator.
 * Includes data binding, command pattern, and observable properties.
 */

import { Binder } from "./Framework/Binding/Binder";
import { Observable } from "./Framework/Binding/Observable";
import {
    LabelAdapter,
    EditBoxAdapter,
    SliderAdapter,
    ToggleAdapter,
    OpacityAdapter,
    ProgressBarAdapter
} from "./Framework/Binding/IUIAdapter";
// Context
import { Context } from "./Framework/Contexts/Context";
// Command
import { CommandBase } from "./Framework/Command/Base/CommandBase";
import { SimpleCommand } from "./Framework/Command/SimpleCommand";
import { AsyncCommand } from "./Framework/Command/AsyncCommand";
import { CompositeCommand } from "./Framework/Command/CompositeCommand";
// Table
import { TableReaderService } from "./Framework/Services/Table/TableReaderService";
import { JsonReader } from "./Framework/Services/Table/Json/JsonReader";
import { ITableModel } from "./Framework/Services/Table/Base/ITableModel";
// Network
import { HttpService } from "./Framework/Services/Net/HttpService";
import { IHttpRequestConfig } from "./Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { HttpMethod } from "./Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { IHttpResponse } from "./Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { IHttpError } from "./Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { HttpDataType } from "./Framework/Services/Net/Adapter/Base/IRequestAdapter";
// UI
import { UILayers } from "./Framework/Services/UI/View/Base/UILayers";
import { UIKey } from "./Framework/Services/UI/View/Base/UIKey";
import { ModelBase } from "./Framework/Services/UI/View/Base/ModelBase";
import { ViewBase } from "./Framework/Services/UI/View/Base/ViewBase";
import { ViewModelBase } from "./Framework/Services/UI/View/Base/ViewModelBase";
import { BindViewModel } from "./Framework/Services/UI/View/Base/BindViewModel";
import { BindModel } from "./Framework/Services/UI/View/Base/BindModel";
import { ViewService } from "./Framework/Services/UI/View/ViewService";
import { AnimationBase } from "./Framework/Services/UI/Animations/Base/AnimationBase";
import { ViewLoadingUIBase } from "./Framework/Services/UI/View/Loading/ViewLoadingUIBase";
import { DefaultViewUILoading } from "./Framework/Services/UI/View/Loading/DefaultViewUILoading";
// Utils
import { EventTrigger } from "./Framework/Utils/EventTrigger";
import { GameUtil } from "./Framework/Utils/GameUtil";
import { ResUtil } from "./Framework/Utils/ResUtil";
// 接口
export type {
    // Table
    ITableModel,
    // Network
    IHttpRequestConfig,
    IHttpResponse,
    IHttpError,
};

// 类
export {
    Binder,
    Observable,

    // Adapters
    LabelAdapter,
    EditBoxAdapter,
    SliderAdapter,
    ToggleAdapter,
    OpacityAdapter,
    ProgressBarAdapter,

    // Command
    CommandBase,
    SimpleCommand,
    AsyncCommand,
    CompositeCommand,

    // Network
    HttpService,
    HttpMethod,
    HttpDataType,

    // UI
    BindViewModel,
    BindModel,
    UILayers,
    ViewService,
    UIKey,
    ModelBase,
    ViewBase,
    ViewModelBase,
    AnimationBase,
    ViewLoadingUIBase,
    DefaultViewUILoading,

    // Table
    TableReaderService,
    JsonReader,

    // Utils
    EventTrigger,
    GameUtil,
    ResUtil,

    // Contexts
    Context
};