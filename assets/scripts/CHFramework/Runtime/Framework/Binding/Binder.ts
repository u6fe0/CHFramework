import { Observable } from './Observable';
import { Label, EditBox } from 'cc';

export class Binder {
    // 单向绑定：Observable 到 UI
    static bind<T>(
        observable: Observable<T>, 
        target: any, 
        property: string = "string"
    ): void {
        if (target instanceof Label && property === "string") {
            observable.subscribe((value: T) => {
                target.string = String(value);
            });
        } else {
            observable.subscribe((value: T) => {
                target[property] = value;
            });
        }
    }

    // 双向绑定：Observable <-> EditBox
    static bindTwoWay(
        observable: Observable<string>,
        editBox: EditBox
    ): void {
        // ViewModel -> EditBox
        observable.subscribe((value: string) => {
            if (editBox.string !== value) {
                editBox.string = value;
            }
        });

        // EditBox -> ViewModel
        editBox.node.on('editing-did-ended', () => {
            if (observable.value !== editBox.string) {
                observable.value = editBox.string;
            }
        });
    }
}