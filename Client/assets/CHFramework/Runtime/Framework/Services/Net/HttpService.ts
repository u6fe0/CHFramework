import { sys } from "cc";
import { IRequestAdapter, IHttpRequestConfig, IHttpResponse, HttpResponseType, HttpMethod, HttpDataType, IHttpError } from "./Adapter/Base/IRequestAdapter";
import { WxRequestAdapter } from "./Adapter/WxRequestAdapter";
import { XhrRequestAdapter } from "./Adapter/XhrRequestAdapter";
/**
 * Http 请求
 */
export class HttpService {
    // 请求适配器
    private _adapter: IRequestAdapter;
    constructor(adapter?: IRequestAdapter) {
        // 允许外部注入自定义适配器（便于单测 / Mock）
        if (adapter) {
            this._adapter = adapter;
        } else {
            switch (sys.platform) {
                case sys.Platform.WECHAT_GAME:
                    this._adapter = new WxRequestAdapter();
                    break;
                default:
                    this._adapter = new XhrRequestAdapter();
                    break;
            }
        }
    }

    public request(config: IHttpRequestConfig): Promise<IHttpResponse> {
        const finalConfig = this.buildConfig(config);
        return new Promise<IHttpResponse>((resolve, reject) => {
            this._adapter.request(finalConfig, resolve, reject);
        });
    }

    public get(url: string, config?: Omit<IHttpRequestConfig, 'url' | 'method'>): Promise<IHttpResponse> {
        return this.request({ url, method: HttpMethod.GET, ...config });
    }

    public post(
        url: string,
        data?: IHttpRequestConfig['data'],
        config?: Omit<IHttpRequestConfig, 'url' | 'method' | 'data'>
    ): Promise<IHttpResponse> {
        return this.request({ url, method: HttpMethod.POST, data, ...config });
    }
    /**
     * 构造配置
     * @param config 
     * @returns 
     */
    private buildConfig(config: IHttpRequestConfig): IHttpRequestConfig {
        const defaultConfig: Omit<IHttpRequestConfig, 'url'> = {
            timeout: 60000,
            responseType: HttpResponseType.TEXT,
            dataType: HttpDataType.JSON,
            method: HttpMethod.GET,
            header: { 'Content-Type': 'application/json' }
        };
        return {
            ...defaultConfig,
            ...config,
            header: {
                ...defaultConfig.header,
                ...config.header
            },
            timeout: config.timeout ?? defaultConfig.timeout,
            responseType: config.responseType ?? defaultConfig.responseType,
            dataType: config.dataType ?? defaultConfig.dataType,
            method: config.method ?? defaultConfig.method
        } as IHttpRequestConfig;
    }
}