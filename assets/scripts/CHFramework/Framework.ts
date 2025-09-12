/**
 * CHFramework
 * A lightweight MVVM framework for Cocos Creator.
 * Includes data binding, command pattern, and observable properties.
 */

import { Preferences } from "./Runtime/Framework/Prefs/Preferences";
import { AbstractFactory } from "./Runtime/Framework/Prefs/AbstractFactory";
import { BinaryFilePreferencesFactory } from "./Runtime/Framework/Prefs/BinaryFilePreferencesFactory";
import type { IFactory } from "./Runtime/Framework/Prefs/IFactory";

import { Binder } from "./Runtime/Framework/Binding/Binder";
import { Command } from "./Runtime/Framework/Binding/Command";
import { Observable } from "./Runtime/Framework/Binding/Observable";
import { LabelAdapter, EditBoxAdapter } from "./Runtime/Framework/Binding/IUIAdapter";

import { UILayers } from "./Runtime/Framework/Views/UI/Core/UILayers";
import { UIManager } from "./Runtime/Framework/Views/UI/Core/UIManager";
import { UIKey } from "./Runtime/Framework/Views/UI/Core/UIKey";
import { UIView } from "./Runtime/Framework/Views/UI/Core/UIView";
import { UILayerConfig } from "./Runtime/Framework/Views/UI/Core/UILayerConfig";
import { IViewModel, ViewModel } from "./Runtime/Framework/Binding/IViewModel";

// 接口
export type { IFactory, IViewModel };

// 类
export {
    Preferences,
    AbstractFactory,
    BinaryFilePreferencesFactory,

    Binder,
    Command,
    Observable,
    LabelAdapter,
    EditBoxAdapter,

    UILayers,
    UIManager,
    UIKey,
    UILayerConfig,
    UIView,
    ViewModel
};