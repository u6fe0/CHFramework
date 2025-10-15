import { IRequestAdapter, IHttpRequestConfig, IHttpResponse, IHttpError, HttpResponseType, HttpDataType } from "./Base/IRequestAdapter";
/**
 * XHR请求适配器
 */
export class XhrRequestAdapter implements IRequestAdapter {
    /**
     * 发送请求
     * @param config 
     * @param resolve 
     * @param reject 
     */
    public request(
        config: IHttpRequestConfig,
        resolve: (resp: IHttpResponse) => void,
        reject: (err: IHttpError) => void
    ): void {
        const xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url, true);
        xhr.responseType = config.responseType;
        xhr.timeout = config.timeout;

        Object.entries(config.header || {}).forEach(([k, v]) => xhr.setRequestHeader(k, String(v)));

        xhr.onload = () => {
            const status = xhr.status;
            if (status >= 200 && status < 300) {
                const headers = this._parseXhrHeaders(xhr.getAllResponseHeaders());
                const data = this._processResponseData(xhr, config);
                const response: IHttpResponse = { statusCode: status, data, header: headers };
                config.success?.(response);
                resolve(response);
            } else {
                this._rejectWith(reject, config, `XHR请求失败,状态码: ${xhr.status}, 响应体: ${xhr.responseText}`, xhr.status, xhr);
            }
        };
        xhr.onerror = () => this._rejectWith(reject, config, 'XHR网络错误(无响应或连接失败)', -1, xhr);
        xhr.ontimeout = () => this._rejectWith(reject, config, `XHR请求超时(${config.timeout}ms)`, -1, xhr);
        xhr.onloadend = () => config.complete?.();

        const sendData = this._formatSendData(config.data, (config.header as any)['Content-Type']);
        xhr.send(sendData);
    }
    /**
     * 请求失败时调用
     * @param reject 
     * @param config 
     * @param msg 
     * @param code 
     * @param ex 
     */
    private _rejectWith(
        reject: (err: IHttpError) => void,
        config: IHttpRequestConfig,
        msg: string,
        code: number,
        ex: any
    ) {
        const httpError: IHttpError = { errMsg: msg, errCode: code, exception: ex };
        console.log('[XHR HTTP Error]', httpError);
        config.fail?.(httpError);
        reject(httpError);
    }
    /**
     * 处理响应数据
     * @param xhr
     * @param config
     */
    private _processResponseData(xhr: XMLHttpRequest, config: IHttpRequestConfig): any {
        if (config.responseType === HttpResponseType.ARRAY_BUFFER) {
            if (config.dataType === HttpDataType.JSON) {
                try {
                    const text = new TextDecoder('utf-8').decode(xhr.response as ArrayBuffer);
                    return JSON.parse(text);
                } catch {
                    return xhr.response;
                }
            }
            return xhr.response;
        }
        const rawText = xhr.responseType === '' || xhr.responseType === 'text'
            ? xhr.responseText
            : String(xhr.response);
        if (config.dataType === HttpDataType.JSON) {
            if (!rawText) return {};
            try { return JSON.parse(rawText); } catch { return rawText; }
        }
        return rawText;
    }

    private _parseXhrHeaders(str: string): Record<string, string> {
        return str.split('\n')
            .map(l => l.trim())
            .filter(l => l)
            .reduce((acc, line) => {
                const idx = line.indexOf(':');
                if (idx > -1) {
                    const k = line.slice(0, idx).trim();
                    const v = line.slice(idx + 1).trim();
                    acc[k] = v;
                }
                return acc;
            }, {} as Record<string, string>);
    }
    /**
     * 格式化发送数据
     * @param data 请求数据
     * @param contentType 请求头中的Content-Type
     * header['content-type'] 为 application/x-www-form-urlencoded 的数据,
     * 会将数据转换成 query string （encodeURIComponent(k)=encodeURIComponent(v)&encodeURIComponent(k)=encodeURIComponent(v)...）
     * @returns 格式化后的数据
     */
    private _formatSendData(data?: IHttpRequestConfig['data'], contentType?: string) {
        if (data === undefined || data === null) return null;
        const ct = contentType?.toLowerCase();
        // 直接透传的二进制 / 表单类型
        if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
            return data;
        }
        if (ct === 'application/x-www-form-urlencoded' && typeof data === 'object') {
            const parts: string[] = [];
            Object.keys(data as Record<string, unknown>).forEach(k => {
                let v: any = (data as any)[k];
                if (v === undefined || v === null) v = '';
                else if (typeof v === 'object') {
                    try {
                        v = JSON.stringify(v);
                    } catch {
                        v = '';
                    }
                } else if (typeof v === 'bigint') {
                    v = v.toString();
                }
                parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
            });
            return parts.join('&');
        }
        // 其他对象 => JSON
        if (typeof data === 'object') {
            try {
                return JSON.stringify(data, (_k, v) => {
                    if (typeof v === 'bigint') return v.toString();
                    if (v instanceof Date) return v.toISOString();
                    return v;
                });
            } catch {
                console.error('[XHR HTTP Error]', '请求数据无法转换为 JSON 字符串');
                return null;
            }
        }
        return data;
    }
}