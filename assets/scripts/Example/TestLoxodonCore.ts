import { ObservableObject } from '../chf/core/ObservableObject';
import { Command } from '../chf/core/ICommand';

/**
 * Simple test to demonstrate the new Loxodon-style MVVM core works
 * This test runs without Cocos Creator dependencies
 */

// Test ViewModel
class TestViewModel extends ObservableObject {
    private _name: string = 'Test';
    private _count: number = 0;
    
    public readonly incrementCommand: Command;
    
    constructor() {
        super();
        this.incrementCommand = new Command(() => this.increment());
    }
    
    get name(): string {
        return this._name;
    }
    
    set name(value: string) {
        this.set('name', this._name, value, (v) => this._name = v);
    }
    
    get count(): number {
        return this._count;
    }
    
    set count(value: number) {
        this.set('count', this._count, value, (v) => this._count = v);
    }
    
    private increment(): void {
        this.count++;
    }
}

// Test the implementation
export function testLoxodonStyleCore(): void {
    console.log('Testing Loxodon-style MVVM Core...');
    
    const vm = new TestViewModel();
    
    // Test property change notifications
    vm.onPropertyChanged((propertyName, newValue, oldValue) => {
        console.log(`Property ${propertyName} changed from ${oldValue} to ${newValue}`);
    });
    
    // Test property changes
    vm.name = 'Updated Test';
    vm.count = 5;
    
    // Test command execution
    console.log(`Before command: count = ${vm.count}`);
    vm.incrementCommand.execute();
    console.log(`After command: count = ${vm.count}`);
    
    console.log('Core test completed successfully!');
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
    testLoxodonStyleCore();
}