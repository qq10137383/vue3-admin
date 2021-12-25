/**
 * Api返回结果
 */
export interface ApiResult<T> {
    /**
     * 状态码
     */
    code: number,
    /**
     * 错误消息
     */
    message?: string
    /**
     * 数据
     */
    data: T
}

export interface ListData<T> {
    items: T[]
}

export interface TotalListData<T> extends ListData<T> {
    total: number
}
