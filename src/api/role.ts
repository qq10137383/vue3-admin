import { AxiosPromise } from 'axios'
import { CustomRouteRecordRaw } from 'vue-router'
import { AddVo, UpdateVo, DeleteVo } from './types'
import request from '@/utils/request'

export interface Role {
    key: string,
    name: string,
    description: string,
    routes: CustomRouteRecordRaw[]
}

export function getRoutes(): AxiosPromise<CustomRouteRecordRaw[]> {
    return request({
        url: '/vue-element-admin/routes',
        method: 'get'
    })
}

export function getRoles(): AxiosPromise<Role[]> {
    return request({
        url: '/vue-element-admin/roles',
        method: 'get'
    })
}

export function addRole(data: Role): AxiosPromise<AddVo> {
    return request({
        url: '/vue-element-admin/role',
        method: 'post',
        data
    })
}

export function updateRole(id: string, data: Role): AxiosPromise<UpdateVo> {
    return request({
        url: `/vue-element-admin/role/${id}`,
        method: 'put',
        data
    })
}

export function deleteRole(id: string): AxiosPromise<DeleteVo> {
    return request({
        url: `/vue-element-admin/role/${id}`,
        method: 'delete'
    })
}
