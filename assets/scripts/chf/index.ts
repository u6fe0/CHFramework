/**
 * CHFramework - Loxodon-style MVVM Framework for Cocos Creator
 * Provides a lightweight core with Loxodon-compatible surface API for data binding
 */

// Core exports
export { INotifyPropertyChanged, PropertyChangedHandler, PropertyChangedEventArgs } from './core/INotifyPropertyChanged';
export { ObservableObject } from './core/ObservableObject';
export { ICommand, Command, AsyncCommand, CanExecuteChangedHandler } from './core/ICommand';

// Binding exports
export { BindingMode, IValueConverter } from './binding/BindingMode';
export { Binding } from './binding/Binding';
export { CommandBinding } from './binding/CommandBinding';

// Target exports
export { PropertyTargets, EventTargets, PropertyTarget, EventTarget } from './targets/ComponentTargets';

// Loxodon-style API exports
export { BindingContext } from './lox/BindingContext';
export { BindingSet, BindingBuilder, CommandBindingBuilder, createBindingSet } from './lox/BindingSet';