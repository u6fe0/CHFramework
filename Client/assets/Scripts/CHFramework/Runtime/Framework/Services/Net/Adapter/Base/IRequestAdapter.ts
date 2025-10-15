/**
 * 请求参数接口（必填项标记为非可选，可选参数带默认值）
 */
export interface IHttpRequestConfig {
    // --- 通用参数 ---
    url: string; // 必传：开发者服务器接口地址
    data?: Object | string | ArrayBuffer; // 可选：string/Object/ArrayBuffer
    header?: Object; // Object
    timeout?: number; // 可选：超时时间（默认60000ms）
    method?: HttpMethod; // 可选：默认GET
    dataType?: HttpDataType; // 可选：响应数据格式（默认json）
    responseType?: HttpResponseType; // 可选：响应类型（用枚举限定）
    // --- 微信小游戏特有参数 ---
    useHighPerformanceMode?: boolean; // 可选：是否使用高性能模式（仅微信小游戏有效，默认false）
    enableHttp2?: boolean; // 可选：是否使用HTTP2（仅微信小游戏有效，默认false）
    enableProfile?: boolean; // 可选：是否开启请求性能上报（仅微信小游戏有效，默认false）
    enableQuick?: boolean; // 可选：是否使用QUIC（仅微信小游戏有效，默认false）
    enableCache?: boolean; // 可选：是否使用缓存（仅微信小游戏有效，默认false）
    enableHttpDNS?: boolean; // 可选：是否使用HTTPDNS（仅微信小游戏有效，默认false）
    httpDNSServiceId?: string; // 可选：HTTPDNS服务ID（仅微信小游戏有效，enableHttpDNS为true时必填）
    httpDNSTimeout?: number; // 可选：HTTPDNS解析超时时间（仅微信小游戏有效，默认5000ms）
    enableChunked?: boolean; // 可选：是否启用分块传输（仅微信小游戏有效，默认false）
    forceCellularNetwork?: boolean; // 可选：是否强制使用蜂窝网络（仅微信小游戏有效，默认false）
    redirect?: string; // 可选：重定向处理（仅微信小游戏有效，默认follow）
    // --- 通用回调函数 ---
    success?: (response: IHttpResponse) => void;
    fail?: (error: IHttpError) => void;
    complete?: () => void;
}

export enum HttpDataType {
    JSON = 'json',
    TEXT = 'text',
}

export enum HttpMethod {
    OPTIONS = 'OPTIONS',
    GET = 'GET',
    HEAD = 'HEAD',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT'
}
/**
 * 响应类型（避免字符串硬编码）
 */
export enum HttpResponseType {
    TEXT = 'text',
    ARRAY_BUFFER = 'arraybuffer'
}

// 响应数据接口（对应wx.request和XHR的统一输出）
export interface IHttpResponse {
    data: string | Object | ArrayBuffer; // 响应数据（与responseType/dataType对应）
    statusCode: number; // HTTP状态码（200/404等）
    header: Object; // 保持为 Object
    cookies?: string[]; // 可选：响应Cookies（wx环境返回）
}

// 错误信息接口（统一错误格式）
export interface IHttpError {
    errMsg: string; // 错误描述
    errCode: number; // 错误码（wx环境返回，XHR环境用HTTP状态码）
    exception: Object; // 存储原始错误信息（便于调试）
}
/**
 * 请求适配器接口
 */
export interface IRequestAdapter {
    request(
        config: IHttpRequestConfig,
        resolve: (resp: IHttpResponse) => void,
        reject: (err: IHttpError) => void
    ): void;
}