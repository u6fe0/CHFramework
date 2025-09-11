import { _decorator, Component, Label, EditBox, Button, Node } from 'cc';
import { LoginViewModel } from './LoginViewModel';
import { createBindingSet } from '../../chf/lox/BindingSet';

const { ccclass, property } = _decorator;

/**
 * Login View component demonstrating Loxodon-style binding usage
 */
@ccclass('LoginViewLox')
export class LoginViewLox extends Component {
    @property(EditBox)
    usernameInput: EditBox = null!;
    
    @property(EditBox)
    passwordInput: EditBox = null!;
    
    @property(Label)
    statusLabel: Label = null!;
    
    @property(Node)
    spinner: Node = null!;
    
    @property(Button)
    loginButton: Button = null!;
    
    @property(Button)
    clearButton: Button = null!;
    
    private vm: LoginViewModel;
    private bindingSet: any;
    
    onLoad() {
        // Initialize ViewModel
        this.vm = new LoginViewModel();
        
        // Create Loxodon-style binding set
        this.bindingSet = createBindingSet(this, this.vm);
        
        // Fluent binding API demonstrating Loxodon-style syntax
        this.bindingSet
            .bind(this.usernameInput).for("text").to("username").twoWay()
            .bind(this.passwordInput).for("text").to("password").twoWay()
            .bind(this.statusLabel).for("text").to("message").oneWay()
            .bind(this.spinner).for("active").to("busy").oneWay()
            .bind(this.loginButton).for("onClick").toCommand("loginCommand").bindInteractable()
            .bind(this.clearButton).for("onClick").toCommand("clearCommand")
            .build();
            
        console.log('LoginViewLox: Loxodon-style bindings created successfully!');
    }
    
    onDestroy() {
        // Cleanup is handled automatically by BindingSet
        if (this.bindingSet) {
            this.bindingSet.dispose();
        }
    }
}