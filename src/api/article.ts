import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { SortablePagedOption, TotalListData, UpdateVo } from './types'

export type ArticleType = 'CN' | 'US' | 'JP' | 'EU'

export type ArticleStatus = 'published' | 'draft'

/**
 * 文章Vo
 */
export interface Article {
    id: number,
    timestamp: number,
    author: string,
    reviewer: string,
    title: string,
    content_short: string,
    content: string,
    forecast: string,
    importance: number,
    type: ArticleType,
    status: ArticleStatus,
    display_time: string,
    comment_disabled: boolean,
    pageviews: string,
    image_uri: string,
    platforms: string[]
}

export interface PV {
    key: string,
    pv: number
}

export interface ArticleQueryDto extends SortablePagedOption {
    importance?: number,
    type?: string,
    title?: string,
    sort?: string
}

export function fetchList(query?: ArticleQueryDto): AxiosPromise<TotalListData<Article>> {
    return request({
        url: '/vue-element-admin/article/list',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id: number): AxiosPromise<Article> {
    return request({
        url: '/vue-element-admin/article/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(): AxiosPromise<PV[]> {
    return request({
        url: '/vue-element-admin/article/pv',
        method: 'get',
    })
}

export function createArticle(data: Article): AxiosPromise<UpdateVo> {
    return request({
        url: '/vue-element-admin/article/create',
        method: 'post',
        data
    })
}

export function updateArticle(data: Article): AxiosPromise<UpdateVo> {
    return request({
        url: '/vue-element-admin/article/update',
        method: 'post',
        data
    })
}
