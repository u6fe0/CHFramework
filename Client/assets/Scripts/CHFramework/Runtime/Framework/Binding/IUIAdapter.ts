import { EditBox, Label, Slider, Toggle } from "cc";

// 定义适配器接口
export interface IUIAdapter<T> {
    setValue(value: T): void;
    getValue(): T;
    onChange(callback: (value: T) => void): void;
}

// 针对 Label 的适配器
export class LabelAdapter implements IUIAdapter<string | number> {
    constructor(private label: Label) { }
    setValue(value: string | number) { this.label.string = String(value); }
    getValue() { return this.label.string; }
    onChange(_: (value: string | number) => void): void { }
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
// 数值版 Label 适配器
export class LabelNumberAdapter implements IUIAdapter<number> {
    constructor(private label: Label) { }
    setValue(value: number) { this.label.string = String(value); }
    getValue() { return Number(this.label.string); } // 若无法解析则为 NaN
    onChange(_: (value: number) => void): void { }
}

// 针对 Slider 的适配器
export class SliderAdapter implements IUIAdapter<number> {
    constructor(private slider: Slider) { }
    setValue(value: number) { this.slider.progress = value; }
    getValue() { return this.slider.progress; }
    onChange(callback: (value: number) => void) {
        this.slider.node.on('slide', () => callback(this.slider.progress));
    }
}

// Toggle
export class ToggleAdapter implements IUIAdapter<boolean> {
    constructor(private toggle: Toggle) { }
    setValue(value: boolean) { this.toggle.isChecked = value; }
    getValue() { return this.toggle.isChecked; }
    onChange(callback: (value: boolean) => void) {
        this.toggle.node.on(Toggle.EventType.TOGGLE, () => callback(this.toggle.isChecked));
    }
}