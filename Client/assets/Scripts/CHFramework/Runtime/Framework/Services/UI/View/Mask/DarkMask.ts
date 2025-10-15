import { Canvas, Color, Sprite, SpriteFrame, Texture2D, tween, UIOpacity } from "cc";
import { MaskType, UIMaskBase } from "./UIMaskBase";

/**
 * 深色遮罩
 */
export class DarkMask extends UIMaskBase {
    maskType: MaskType = MaskType.Dark;
    sprite: Sprite;
    // 遮罩默认颜色
    color: Color = new Color(0, 0, 0, 150);
    opacity: UIOpacity;
    constructor(canvas: Canvas) {
        super(canvas);

        this.newSprite();
        this.updateSize();
        this.opacity = this.node.addComponent(UIOpacity);
        this.opacity.opacity = 0;
    }
    /**
     * 添加遮罩
     */
    newSprite() {
        const sprite = this.node.addComponent(Sprite);
        const spriteFrame = new SpriteFrame();
        const buffer = Uint8Array.from([this.color.r, this.color.g, this.color.b, this.color.a]);
        const texture = new Texture2D();
        texture.reset({ width: 1, height: 1, format: Texture2D.PixelFormat.RGBA8888, mipmapLevel: 0 });
        texture.uploadData(buffer, 0, 0);
        texture.updateImage();
        spriteFrame.texture = texture;
        sprite.spriteFrame = spriteFrame;

        this.sprite = sprite;
    }
    /**
     * 显示遮罩-带动画
     */
    onShow(): void {
        tween(this.opacity)
            .to(0.2, { opacity: 150 })
            .start();
    }
    /**
     * 隐藏遮罩
     */
    onHide(): void {
        this.opacity.opacity = 0;
    }
}