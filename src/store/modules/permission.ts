import type { CustomRouteRecordRaw } from "vue-router"
import { ActionTree, Module, MutationTree } from "vuex"
import type { AllState } from "../index"

import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断用户是否有路由权限
 * @param roles 用户角色
 * @param route 路由
 * @returns 
 */
function hasPermission(roles: string[], route: CustomRouteRecordRaw): boolean {
    return roles.some(role => (route.meta?.roles ?? []).includes(role))
}

/**
 * 过滤用户路由权限
 * @param routes 路由
 * @param roles 用户角色
 * @returns 
 */
export function filterAsyncRoutes(routes: CustomRouteRecordRaw[], roles: string[]): CustomRouteRecordRaw[] {
    const res: CustomRouteRecordRaw[] = []

    routes.forEach(route => {
        const tmp: CustomRouteRecordRaw = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

/**
 * Permission State
 */
export type PermissionState = {
    /**
     * 所有路由
     */
    routes: CustomRouteRecordRaw[],
    /**
     * 动态路由
     */
    addRoutes: CustomRouteRecordRaw[]
}

const state: PermissionState = {
    routes: [],
    addRoutes: []
}

const mutations: MutationTree<PermissionState> = {
    SET_ROUTES(state, routes: CustomRouteRecordRaw[]) {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions: ActionTree<PermissionState, AllState> = {
    generateRoutes({ commit }, roles: string[]): Promise<CustomRouteRecordRaw[]> {
        return new Promise(resolve => {
            let accessedRoutes: CustomRouteRecordRaw[]
            if (roles.includes('admin')) {
                accessedRoutes = asyncRoutes ?? []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            }
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

const permission: Module<PermissionState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default permission;