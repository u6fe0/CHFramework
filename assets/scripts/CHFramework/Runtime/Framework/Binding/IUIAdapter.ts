import { EditBox, Label } from "cc";

// 定义适配器接口
export interface IUIAdapter<T> {
    setValue(value: T): void;
    getValue(): T;
    onChange(callback: (value: T) => void): void;
}

// 针对 Label 的适配器
export class LabelAdapter<T extends string | number> implements IUIAdapter<T> {
    constructor(private label: Label) { }

    setValue(value: T): void {
        this.label.string = value.toString();
    }

    getValue(): T {
        // 如果 T 是 number，则返回 number，否则返回 string
        if (typeof ("" as T) === "number") {
            return Number(this.label.string) as T;
        }
        return this.label.string as T;
    }

    onChange(_: (value: T) => void): void {
        // Label 通常不需要监听变化
    }
}
// 针对 EditBox 的适配器
export class EditBoxAdapter implements IUIAdapter<string> {
    constructor(private editBox: EditBox) { }
    setValue(value: string) { this.editBox.string = value; }
    getValue() { return this.editBox.string; }
    onChange(callback: (value: string) => void) {
        this.editBox.node.on('editing-did-ended', () => callback(this.editBox.string));
    }
}