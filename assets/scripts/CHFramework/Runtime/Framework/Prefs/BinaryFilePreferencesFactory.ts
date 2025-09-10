/**
 * A factory that creates instances of BinaryFilePreferences.
 */
import { Preferences } from "./Preferences";
import { AbstractFactory } from "./AbstractFactory";


export class BinaryFilePreferencesFactory extends AbstractFactory<BinaryFilePreferences> {
    create(): BinaryFilePreferences {
        return new BinaryFilePreferences();
    }
}

export class BinaryFilePreferences extends Preferences {
    // Implementation of BinaryFilePreferences
    // 写一个测试方法
    testMethod(): void {
        console.log("This is a test method in BinaryFilePreferences.");
    }
}