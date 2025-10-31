import { AssetManager, AudioClip, AudioSource, Canvas, director, Node } from "cc";
import { Context } from "../../../Runtime/Framework";
import { GamePrefService } from "../Preference/GamePref/GamePrefService";
/**
 * 音频配置
 */
interface IAudioConfig {
    bundleName: string;
    pathPrefix: string;
}
/**
 * 音效服务
 */
export class AudioService {
    private _config: IAudioConfig;
    private _audioBGMSource: AudioSource;
    private _audioSFXSource: AudioSource;
    private _targetBGM: string = null;
    constructor(config: IAudioConfig = { bundleName: "resources", pathPrefix: "Audio" }) {
        this._config = config;
        // 初始化音频系统
        const scene = director.getScene();
        let canvas: Canvas = null;
        for (const node of scene.children) {
            canvas = node.getComponent(Canvas);
            if (canvas) break;
        }
        if (!canvas) throw new Error('[AudioService] 当前场景中未找到 Canvas 节点，无法初始化。');
        const audioNode = new Node("AudioService");
        canvas.node.addChild(audioNode);

        this._audioBGMSource = audioNode.addComponent(AudioSource);
        this._audioSFXSource = audioNode.addComponent(AudioSource);
        // 根据用户配置初始化音量
        const gamePref = Context.getService(GamePrefService).gamePrefModel;
        this._audioBGMSource.volume = gamePref.bgmVolume;
        this._audioBGMSource.enabled = gamePref.isBgmOn;
        this._audioSFXSource.volume = gamePref.sfxVolume;
        this._audioSFXSource.enabled = gamePref.isSfxOn;


    }
    /**
     * 设置背景音乐音量
     * @param volume 
     */
    public setBgmVolume(volume: number) {
        this._audioBGMSource.volume = volume;
    }
    /**
     * 设置背景音乐开关
     * @param enable 
     */
    public setBgmEnable(enable: boolean) {
        this._audioBGMSource.enabled = enable;
        if (!enable) {
            this.stopBgm();
        } else if (this._targetBGM) {
            this.playBgm(this._targetBGM);
        }
    }
    /**
     * 设置音效音量
     * @param volume 
     */
    public setSfxVolume(volume: number) {
        this._audioSFXSource.volume = volume;
    }
    /**
     * 设置音效开关
     * @param enable 
     */
    public setSfxEnable(enable: boolean) {
        this._audioSFXSource.enabled = enable;
    }
    public resumeBgm() {
        this.playBgm(this._targetBGM);
    }
    /**
     * 播放背景音乐
     * @param clipName 音频名称
     * @param loop 是否循环播放
     * @returns
     */
    public async playBgm(clipName: string, loop: boolean = true) {
        if (!clipName) return;
        if (this._targetBGM === clipName && this._audioBGMSource.playing) {
            // 已经在播放目标 BGM，无需重复播放
            return;
        }
        this._targetBGM = clipName;
        const gamePref = Context.getService(GamePrefService).gamePrefModel;
        if (!gamePref.isBgmOn) {
            // 背景音乐开关关闭，不播放
            return;
        }
        // play
        const audioClipPath = `${this._config.pathPrefix}/BGM/${this._targetBGM}`;
        const audioClip = await this.loadClip(this._config.bundleName, audioClipPath);
        if (audioClip.name !== this._targetBGM) {
            // 用户在等待加载过程中切换了 BGM，取消播放
            return;
        }
        this._audioBGMSource.stop();
        this._audioBGMSource.clip = audioClip;
        this._audioBGMSource.loop = loop;
        this._audioBGMSource.play();
    }
    /**
     * 停止背景音乐
     * @returns
     */
    public stopBgm() {
        if (this._audioBGMSource) {
            this._audioBGMSource.stop();
        }
    }
    /**
     * 播放一次音效
     * @param clipName 音频名称
     * @param volumeScale 音量缩放
     * @returns
     */
    public async playOneShot(clipName: string, volumeScale?: number) {
        if (!clipName) return;
        const gamePref = Context.getService(GamePrefService).gamePrefModel;
        if (!gamePref.isSfxOn) {
            // 音效开关关闭，不播放
            return;
        }
        const audioClipPath = `${this._config.pathPrefix}/SFX/${clipName}`;
        const audioClip = await this.loadClip(this._config.bundleName, audioClipPath);
        this._audioSFXSource.playOneShot(audioClip, gamePref.sfxVolume * (volumeScale ?? 1.0));
    }
    /**
     * 加载音频剪辑
     * @param bundleName 资源包名称
     * @param audioClipPath 音频剪辑路径
     * @returns 音频剪辑对象
     */
    private async loadClip(bundleName: string, audioClipPath: string): Promise<AudioClip> {
        return new Promise((resolve, reject) => {
            const bundle = AssetManager.instance.getBundle(bundleName);
            if (!bundle) {
                return reject(new Error(`[AudioService] 未找到 bundle: ${bundleName}`));
            }
            bundle.load(audioClipPath, AudioClip, (err, asset) => {
                if (err || !asset) {
                    return reject(new Error(`[AudioService] 加载音频失败: bundleName=${bundleName}, audioClipPath=${audioClipPath}`));
                }
                resolve(asset);
            });
        });
    }
}