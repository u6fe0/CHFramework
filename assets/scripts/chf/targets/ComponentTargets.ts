import { Label, EditBox, Button, Toggle, Node, Component } from 'cc';

/**
 * Property target information for binding
 */
export interface PropertyTarget {
    get: (target: any) => any;
    set: (target: any, value: any) => void;
    onChange?: (target: any, handler: () => void) => void;
    offChange?: (target: any, handler: () => void) => void;
}

/**
 * Event target information for command binding
 */
export interface EventTarget {
    eventName: string;
    target: any; // Can be the component itself or its node
}

/**
 * Property mappings for Cocos Creator components
 */
export class PropertyTargets {
    private static readonly _targets: { [key: string]: PropertyTarget } = {};
    
    static {
        // Label targets
        this.register('text', {
            get: (target: Label) => target.string,
            set: (target: Label, value: string) => { target.string = value; }
        });
        
        // EditBox targets  
        this.register('text', {
            get: (target: EditBox) => target.string,
            set: (target: EditBox, value: string) => { target.string = value; },
            onChange: (target: EditBox, handler: () => void) => {
                target.node.on('editing-did-ended', handler);
                target.node.on('text-changed', handler);
            },
            offChange: (target: EditBox, handler: () => void) => {
                target.node.off('editing-did-ended', handler);
                target.node.off('text-changed', handler);
            }
        });
        
        // Toggle targets
        this.register('isChecked', {
            get: (target: Toggle) => target.isChecked,
            set: (target: Toggle, value: boolean) => { target.isChecked = value; },
            onChange: (target: Toggle, handler: () => void) => {
                target.node.on('toggle', handler);
            },
            offChange: (target: Toggle, handler: () => void) => {
                target.node.off('toggle', handler);
            }
        });
        
        // Node targets
        this.register('active', {
            get: (target: Node) => target.active,
            set: (target: Node, value: boolean) => { target.active = value; }
        });
        
        // Button targets (for interactable)
        this.register('interactable', {
            get: (target: Button) => target.interactable,
            set: (target: Button, value: boolean) => { target.interactable = value; }
        });
        
        // Generic Component targets
        this.register('enabled', {
            get: (target: Component) => target.enabled,
            set: (target: Component, value: boolean) => { target.enabled = value; }
        });
    }
    
    /**
     * Register a property target
     */
    static register(propertyName: string, target: PropertyTarget): void {
        this._targets[propertyName] = target;
    }
    
    /**
     * Get property target for a property name
     */
    static get(propertyName: string): PropertyTarget | undefined {
        return this._targets[propertyName];
    }
    
    /**
     * Get property target for a specific component and property
     */
    static getForComponent(component: any, propertyName: string): PropertyTarget | undefined {
        const target = this.get(propertyName);
        if (target) {
            return target;
        }
        
        // Fallback to generic property access
        return {
            get: (comp: any) => comp[propertyName],
            set: (comp: any, value: any) => { comp[propertyName] = value; }
        };
    }
}

/**
 * Event mappings for Cocos Creator components
 */
export class EventTargets {
    private static readonly _targets: { [key: string]: EventTarget } = {};
    
    static {
        // Button click event
        this.register('onClick', {
            eventName: Button.EventType.CLICK,
            target: null // Will be set to the component's node
        });
        
        // EditBox events
        this.register('onTextChanged', {
            eventName: 'text-changed',
            target: null
        });
        
        this.register('onEditingDidEnded', {
            eventName: 'editing-did-ended', 
            target: null
        });
        
        // Toggle events
        this.register('onToggle', {
            eventName: 'toggle',
            target: null
        });
    }
    
    /**
     * Register an event target
     */
    static register(eventName: string, target: EventTarget): void {
        this._targets[eventName] = target;
    }
    
    /**
     * Get event target for an event name
     */
    static get(eventName: string): EventTarget | undefined {
        return this._targets[eventName];
    }
    
    /**
     * Get event target for a specific component and event
     */
    static getForComponent(component: any, eventName: string): EventTarget | undefined {
        const target = this.get(eventName);
        if (target) {
            return {
                eventName: target.eventName,
                target: component.node || component
            };
        }
        
        // Fallback for custom events
        return {
            eventName: eventName,
            target: component.node || component
        };
    }
}