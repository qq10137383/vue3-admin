import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ListData, TotalListData } from './types'

export interface NameVo {
    name: string
}

export function searchUser(name: string): AxiosPromise<ListData<NameVo>> {
    return request({
        url: '/vue-element-admin/search/user',
        method: 'get',
        params: { name }
    })
}

export interface TransactionVo {
    order_no: string,
    timestamp: number,
    username: string,
    price: number,
    status: 'success' | 'pending'
}

export function transactionList(query?: unknown): AxiosPromise<TotalListData<TransactionVo>> {
    return request({
        url: '/vue-element-admin/transaction/list',
        method: 'get',
        params: query
    })
}
