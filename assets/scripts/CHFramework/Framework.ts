/**
 * CHFramework
 * A lightweight MVVM framework for Cocos Creator.
 * Includes data binding, command pattern, and observable properties.
 * Now with Loxodon-style API for enhanced developer experience.
 */

import { Preferences } from "./Runtime/Framework/Prefs/Preferences";
import { AbstractFactory } from "./Runtime/Framework/Prefs/AbstractFactory";
import { BinaryFilePreferencesFactory } from "./Runtime/Framework/Prefs/BinaryFilePreferencesFactory";
import type { IFactory } from "./Runtime/Framework/Prefs/IFactory";

import { Binder } from "./Runtime/Framework/Binding/Binder";
import { Command } from "./Runtime/Framework/Binding/Command";
import { Observable } from "./Runtime/Framework/Binding/Observable";
import { PropertyChanged } from "./Runtime/Framework/Binding/PropertyChanged";

// Loxodon-style CHF exports
export * from '../chf/index';

// 接口
export type { IFactory };

// 类 (Legacy - kept for backward compatibility)
export {
    Preferences,
    AbstractFactory,
    BinaryFilePreferencesFactory,

    Binder,
    Command,
    Observable,
    PropertyChanged
};