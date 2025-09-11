import { ObservableObject } from '../../chf/core/ObservableObject';
import { Command, AsyncCommand } from '../../chf/core/ICommand';

/**
 * Login ViewModel demonstrating Loxodon-style MVVM pattern
 */
export class LoginViewModel extends ObservableObject {
    private _username: string = '';
    private _password: string = '';
    private _message: string = 'Please enter your credentials';
    private _busy: boolean = false;
    
    public readonly loginCommand: AsyncCommand;
    public readonly clearCommand: Command;
    
    constructor() {
        super();
        
        this.loginCommand = new AsyncCommand(
            (parameter, callback) => this.onLogin(parameter, callback),
            (parameter) => this.canLogin()
        );
        
        this.clearCommand = new Command(
            (parameter) => this.onClear(parameter)
        );
    }
    
    /**
     * Username property
     */
    get username(): string {
        return this._username;
    }
    
    set username(value: string) {
        this.set('username', this._username, value, (v) => this._username = v);
        this.loginCommand.raiseCanExecuteChanged();
    }
    
    /**
     * Password property
     */
    get password(): string {
        return this._password;
    }
    
    set password(value: string) {
        this.set('password', this._password, value, (v) => this._password = v);
        this.loginCommand.raiseCanExecuteChanged();
    }
    
    /**
     * Status message property
     */
    get message(): string {
        return this._message;
    }
    
    set message(value: string) {
        this.set('message', this._message, value, (v) => this._message = v);
    }
    
    /**
     * Busy state property
     */
    get busy(): boolean {
        return this._busy;
    }
    
    set busy(value: boolean) {
        this.set('busy', this._busy, value, (v) => this._busy = v);
    }
    
    /**
     * Login command implementation
     */
    private onLogin(parameter?: any, callback?: () => void): void {
        this.busy = true;
        this.message = 'Logging in...';
        
        // Simulate async login operation with callback
        this.simulateAsyncLogin(() => {
            try {
                // Check credentials (simple demo logic)
                if (this.username === 'admin' && this.password === 'password') {
                    this.message = `Welcome, ${this.username}!`;
                } else {
                    this.message = 'Invalid credentials. Try admin/password';
                }
            } catch (error) {
                this.message = 'Login failed. Please try again.';
            } finally {
                this.busy = false;
                if (callback) callback();
            }
        });
    }
    
    /**
     * Clear command implementation
     */
    private onClear(parameter?: any): void {
        this.username = '';
        this.password = '';
        this.message = 'Please enter your credentials';
    }
    
    /**
     * Can login predicate
     */
    private canLogin(): boolean {
        return !this.busy && 
               this.username.length > 0 && 
               this.password.length > 0;
    }
    
    /**
     * Simulate async login operation (ES5 compatible)
     */
    private simulateAsyncLogin(callback: () => void): void {
        setTimeout(() => callback(), 2000); // 2 second delay
    }
}