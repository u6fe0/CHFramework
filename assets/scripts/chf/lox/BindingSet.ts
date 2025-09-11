import { Component, Node } from 'cc';
import { Binding } from '../binding/Binding';
import { BindingMode, IValueConverter } from '../binding/BindingMode';
import { CommandBinding } from '../binding/CommandBinding';
import { PropertyTargets, EventTargets } from '../targets/ComponentTargets';
import { ICommand } from '../core/ICommand';
import { BindingContext } from './BindingContext';

/**
 * Fluent binding builder that mimics Loxodon Framework's BindingSet API
 */
export class BindingSet {
    private _bindings: Binding[] = [];
    private _commandBindings: CommandBinding[] = [];
    private _isBuilt: boolean = false;
    
    constructor(
        private _view: Component | Node,
        private _viewModel: any
    ) {}
    
    /**
     * Start a new binding chain for a target component
     */
    bind(target: any): BindingBuilder {
        return new BindingBuilder(this, target, this._viewModel);
    }
    
    /**
     * Build and activate all bindings
     */
    build(): BindingSet {
        if (this._isBuilt) {
            throw new Error('BindingSet has already been built');
        }
        
        this._isBuilt = true;
        
        // Set up automatic disposal when the view is destroyed
        this.setupAutoDisposal();
        
        return this;
    }
    
    /**
     * Dispose all bindings
     */
    dispose(): void {
        for (const binding of this._bindings) {
            binding.dispose();
        }
        
        for (const binding of this._commandBindings) {
            binding.dispose();
        }
        
        this._bindings.length = 0;
        this._commandBindings.length = 0;
    }
    
    /**
     * Add a property binding to the set
     */
    addBinding(binding: Binding): void {
        this._bindings.push(binding);
    }
    
    /**
     * Add a command binding to the set
     */
    addCommandBinding(binding: CommandBinding): void {
        this._commandBindings.push(binding);
    }
    
    private setupAutoDisposal(): void {
        // Auto-dispose when the view component is destroyed
        if (this._view instanceof Component) {
            const originalOnDestroy = this._view.onDestroy?.bind(this._view);
            this._view.onDestroy = () => {
                this.dispose();
                if (originalOnDestroy) {
                    originalOnDestroy();
                }
            };
        } else if (this._view instanceof Node) {
            this._view.on(Node.EventType.NODE_DESTROYED, () => {
                this.dispose();
            });
        }
    }
}

/**
 * Fluent builder for individual bindings
 */
export class BindingBuilder {
    constructor(
        private _bindingSet: BindingSet,
        private _target: any,
        private _viewModel: any,
        private _targetProperty?: string,
        private _sourcePath?: string,
        private _mode?: BindingMode,
        private _converter?: IValueConverter,
        private _converterParameter?: any
    ) {}
    
    /**
     * Specify the target property to bind to
     */
    for(propertyName: string): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            propertyName,
            this._sourcePath,
            this._mode,
            this._converter,
            this._converterParameter
        );
    }
    
    /**
     * Specify the source property path
     */
    to(sourcePath: string): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty,
            sourcePath,
            this._mode,
            this._converter,
            this._converterParameter
        );
    }
    
    /**
     * Specify command binding
     */
    toCommand(commandPath: string): CommandBindingBuilder {
        return new CommandBindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty || 'onClick',
            commandPath
        );
    }
    
    /**
     * Set binding mode to OneWay
     */
    oneWay(): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty,
            this._sourcePath,
            BindingMode.OneWay,
            this._converter,
            this._converterParameter
        );
    }
    
    /**
     * Set binding mode to TwoWay
     */
    twoWay(): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty,
            this._sourcePath,
            BindingMode.TwoWay,
            this._converter,
            this._converterParameter
        );
    }
    
    /**
     * Set binding mode to OneTime
     */
    oneTime(): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty,
            this._sourcePath,
            BindingMode.OneTime,
            this._converter,
            this._converterParameter
        );
    }
    
    /**
     * Set value converter
     */
    withConverter(converter: IValueConverter, parameter?: any): BindingBuilder {
        return new BindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._targetProperty,
            this._sourcePath,
            this._mode,
            converter,
            parameter
        );
    }
    
    /**
     * Create the binding and add it to the set
     */
    build(): BindingSet {
        if (!this._targetProperty || !this._sourcePath) {
            throw new Error('Target property and source path must be specified');
        }
        
        const binding = new Binding(
            this._viewModel,
            this._sourcePath,
            this._target,
            this._targetProperty,
            this._mode || BindingMode.OneWay,
            this._converter,
            this._converterParameter
        );
        
        this._bindingSet.addBinding(binding);
        return this._bindingSet;
    }
}

/**
 * Fluent builder for command bindings
 */
export class CommandBindingBuilder {
    constructor(
        private _bindingSet: BindingSet,
        private _target: any,
        private _viewModel: any,
        private _eventName: string,
        private _commandPath: string,
        private _parameter?: any,
        private _bindInteractable: boolean = false
    ) {}
    
    /**
     * Bind the command's CanExecute to the target's interactable property
     */
    bindInteractable(): CommandBindingBuilder {
        return new CommandBindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._eventName,
            this._commandPath,
            this._parameter,
            true
        );
    }
    
    /**
     * Set command parameter
     */
    withParameter(parameter: any): CommandBindingBuilder {
        return new CommandBindingBuilder(
            this._bindingSet,
            this._target,
            this._viewModel,
            this._eventName,
            this._commandPath,
            parameter,
            this._bindInteractable
        );
    }
    
    /**
     * Create the command binding and add it to the set
     */
    build(): BindingSet {
        // Get the command from the view model
        const command = this.getPropertyValue(this._viewModel, this._commandPath) as ICommand;
        if (!command) {
            throw new Error(`Command not found at path: ${this._commandPath}`);
        }
        
        // Get event target info
        const eventTarget = EventTargets.getForComponent(this._target, this._eventName);
        if (!eventTarget) {
            throw new Error(`Event target not found for: ${this._eventName}`);
        }
        
        const commandBinding = new CommandBinding(
            eventTarget.target,
            eventTarget.eventName,
            command,
            this._parameter,
            this._bindInteractable
        );
        
        this._bindingSet.addCommandBinding(commandBinding);
        return this._bindingSet;
    }
    
    private getPropertyValue(obj: any, path: string): any {
        if (!obj || !path) return undefined;
        
        const parts = path.split('.');
        let current = obj;
        
        for (const part of parts) {
            if (current == null) return undefined;
            current = current[part];
        }
        
        return current;
    }
}

/**
 * Create a new BindingSet for a view and view model
 */
export function createBindingSet(view: Component | Node, viewModel: any): BindingSet {
    return new BindingSet(view, viewModel);
}