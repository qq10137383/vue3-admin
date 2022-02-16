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

export enum ResponseStatus {
    Success = 'success',
    Failed = 'failed'
}

export interface AddVo {
    key: string
}

export interface UpdateVo {
    status: ResponseStatus
}

export type DeleteVo = UpdateVo

export interface ListData<T> {
    items: T[]
}

export interface TotalListData<T> extends ListData<T> {
    total: number
}

export interface PagedOption {
    page?: number
    limit?: 20
}

export interface SortablePagedOption extends PagedOption {
    sort?: string
}