/**
 * Api返回结果
 */
export default interface ApiResult<T> {
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