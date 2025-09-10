import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { BinaryFilePreferencesFactory, IFactory } from '../CHFramework/Framework';

class ShoeFactory implements IFactory<string> {
    create(): string {
        return "A pair of shoes";
    }
}

class HatFactory implements IFactory<string> {
    create(): string {
        return "A stylish hat";
    }
}


@ccclass('Test')
export class Test extends Component {
    start() {
        this.testBinaryFilePreferences();
    }

    testBinaryFilePreferences() {
        const prefs = new ShoeFactory().create();
        console.log(prefs); // Output: A pair of shoes

        const hat = new HatFactory().create();
        console.log(hat); // Output: A stylish hat

        const binaryPrefs = new BinaryFilePreferencesFactory().create();
        binaryPrefs.testMethod(); // Output: This is a test method in BinaryFilePreferences.
    }
}


