/**
 * CHFramework
 * A lightweight MVVM framework for Cocos Creator.
 * Includes data binding, command pattern, and observable properties.
 */

import { Binder } from "./Runtime/Framework/Binding/Binder";
import { Observable } from "./Runtime/Framework/Binding/Observable";
import {
    LabelAdapter,
    EditBoxAdapter,
    SliderAdapter,
    ToggleAdapter,
    OpacityAdapter,
    ProgressBarAdapter
} from "./Runtime/Framework/Binding/IUIAdapter";
// Context
import { Context } from "./Runtime/Framework/Contexts/Context";
// Command
import { CommandBase } from "./Runtime/Framework/Command/Base/CommandBase";
import { SimpleCommand } from "./Runtime/Framework/Command/SimpleCommand";
import { AsyncCommand } from "./Runtime/Framework/Command/AsyncCommand";
import { CompositeCommand } from "./Runtime/Framework/Command/CompositeCommand";
// Table
import { TableReaderService } from "./Runtime/Framework/Services/Table/TableReaderService";
import { JsonReader } from "./Runtime/Framework/Services/Table/Json/JsonReader";
import { ITableModel } from "./Runtime/Framework/Services/Table/Base/ITableModel";
// Network
import { HttpService } from "./Runtime/Framework/Services/Net/HttpService";
import { IHttpRequestConfig } from "./Runtime/Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { HttpMethod } from "./Runtime/Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { IHttpResponse } from "./Runtime/Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { IHttpError } from "./Runtime/Framework/Services/Net/Adapter/Base/IRequestAdapter";
import { HttpDataType } from "./Runtime/Framework/Services/Net/Adapter/Base/IRequestAdapter";
// UI
import { UILayers } from "./Runtime/Framework/Services/UI/View/Base/UILayers";
import { UIKey } from "./Runtime/Framework/Services/UI/View/Base/UIKey";
import { ModelBase } from "./Runtime/Framework/Services/UI/View/Base/ModelBase";
import { ViewBase } from "./Runtime/Framework/Services/UI/View/Base/ViewBase";
import { ViewModelBase } from "./Runtime/Framework/Services/UI/View/Base/ViewModelBase";
import { BindViewModel } from "./Runtime/Framework/Services/UI/View/Base/BindViewModel";
import { BindModel } from "./Runtime/Framework/Services/UI/View/Base/BindModel";
import { ViewService } from "./Runtime/Framework/Services/UI/View/ViewService";
import { AnimationBase } from "./Runtime/Framework/Services/UI/Animations/Base/AnimationBase";
import { ViewLoadingUIBase } from "./Runtime/Framework/Services/UI/View/Loading/ViewLoadingUIBase";
import { DefaultViewUILoading } from "./Runtime/Framework/Services/UI/View/Loading/DefaultViewUILoading";
// Utils
import { EventTrigger } from "./Runtime/Framework/Utils/EventTrigger";
import { GameUtil } from "./Runtime/Framework/Utils/GameUtil";
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

    // Contexts
    Context
};