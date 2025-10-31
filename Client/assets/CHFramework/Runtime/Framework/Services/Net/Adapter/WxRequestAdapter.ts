import { IRequestAdapter, IHttpRequestConfig, IHttpResponse, IHttpError } from "./Base/IRequestAdapter";
/**
 * 微信请求适配器
 */
export class WxRequestAdapter implements IRequestAdapter {
    public request(
        config: IHttpRequestConfig,
        resolve: (resp: IHttpResponse) => void,
        reject: (err: IHttpError) => void
    ): void {
        (window as any).wx.request({
            url: config.url,
            method: config.method,
            data: config.data,
            header: config.header,
            timeout: config.timeout,
            responseType: config.responseType,
            dataType: config.dataType,
            useHighPerformanceMode: config.useHighPerformanceMode,
            enableHttp2: config.enableHttp2,
            enableProfile: config.enableProfile,
            enableQuick: config.enableQuick,
            enableCache: config.enableCache,
            enableHttpDNS: config.enableHttpDNS,
            httpDNSServiceId: config.httpDNSServiceId,
            httpDNSTimeout: config.httpDNSTimeout,
            enableChunked: config.enableChunked,
            forceCellularNetwork: config.forceCellularNetwork,
            redirect: config.redirect,
            success: (res: any) => {
                const response: IHttpResponse = {
                    statusCode: res.statusCode,
                    data: res.data,
                    header: res.header as Record<string, string>
                };
                config.success?.(response);
                resolve(response);
            },
            fail: (err: any) => {
                const httpError: IHttpError = {
                    errMsg: err.errMsg || '微信请求失败',
                    errCode: err.errno ?? -1,
                    exception: err
                };
                console.log('[WX HTTP Error]', httpError);
                config.fail?.(httpError);
                reject(httpError);
            },
            complete: () => {
                config.complete?.();
            }
        });
    }
}