# CHFramework - Loxodon-style MVVM for Cocos Creator

CHFramework now provides a Loxodon Framework-compatible API layer on top of a lightweight, engine-agnostic core. This gives you the familiar Loxodon developer experience while staying idiomatic to Cocos Creator and TypeScript.

## Quick Start

### 1. Create a ViewModel

```typescript
import { ObservableObject, Command, AsyncCommand } from '../CHFramework/Framework';

export class LoginViewModel extends ObservableObject {
    private _username: string = '';
    private _password: string = '';
    
    public readonly loginCommand: AsyncCommand;
    public readonly clearCommand: Command;
    
    constructor() {
        super();
        
        this.loginCommand = new AsyncCommand(
            () => this.onLogin(),
            () => this.canLogin()
        );
        
        this.clearCommand = new Command(() => this.onClear());
    }
    
    get username(): string {
        return this._username;
    }
    
    set username(value: string) {
        this.set('username', this._username, value, (v) => this._username = v);
        this.loginCommand.raiseCanExecuteChanged();
    }
    
    // ... other properties and methods
}
```

### 2. Create a View with Loxodon-style Bindings

```typescript
import { _decorator, Component, Label, EditBox, Button } from 'cc';
import { createBindingSet } from '../CHFramework/Framework';
import { LoginViewModel } from './LoginViewModel';

@ccclass('LoginView')
export class LoginView extends Component {
    @property(EditBox) usernameInput: EditBox = null!;
    @property(EditBox) passwordInput: EditBox = null!;
    @property(Label) statusLabel: Label = null!;
    @property(Button) loginButton: Button = null!;
    @property(Button) clearButton: Button = null!;
    
    private vm: LoginViewModel;
    
    onLoad() {
        this.vm = new LoginViewModel();
        
        // Loxodon-style fluent binding API
        const set = createBindingSet(this, this.vm);
        set.bind(this.usernameInput).for("text").to("username").twoWay()
           .bind(this.passwordInput).for("text").to("password").twoWay()
           .bind(this.statusLabel).for("text").to("message").oneWay()
           .bind(this.loginButton).for("onClick").toCommand("loginCommand").bindInteractable()
           .bind(this.clearButton).for("onClick").toCommand("clearCommand")
           .build();
    }
}
```

## Core Components

### ObservableObject
Provides INotifyPropertyChanged-compatible API:
- `onPropertyChanged(handler)` / `offPropertyChanged(handler)`
- `raisePropertyChanged(propertyName, newValue, oldValue)`
- `set(propertyName, currentValue, newValue, setter)` helper

### ICommand / Command / AsyncCommand
Command pattern with CanExecute support:
- `execute(parameter)` / `canExecute(parameter)`
- `onCanExecuteChanged(handler)` / `offCanExecuteChanged(handler)`
- AsyncCommand provides automatic busy state management

### BindingSet (Loxodon-style API)
Fluent binding builder:
```typescript
createBindingSet(view, viewModel)
    .bind(target).for("property").to("viewModelProperty").oneWay()
    .bind(button).for("onClick").toCommand("commandName").bindInteractable()
    .build();
```

## Property Mappings

The framework automatically maps common properties:
- `text` → Label.string / EditBox.string  
- `isChecked` → Toggle.isChecked
- `active` → Node.active
- `onClick` → Button click event (for commands)
- `interactable` → Button.interactable (for command CanExecute)

## Binding Modes

- `OneWay` - Source to target only
- `TwoWay` - Bidirectional binding  
- `OneTime` - Single initial binding

## Current Limitations

This initial release focuses on core binding functionality. Future versions will add:
- ObservableCollection + virtualized lists
- DataTemplate/Item templates  
- Navigator for view management
- I18N support
- Validation framework

## Migration from Legacy API

The existing Observable/Command/Binder API remains available for backward compatibility. New projects should use the Loxodon-style API for better developer experience.

## Example

See `assets/scripts/Example/Login/` for a complete working example demonstrating the Loxodon-style API.