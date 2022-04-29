import { ref } from 'vue'
import { defineStore } from "pinia"
import type { CustomRouteRecordRaw } from "vue-router"
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断用户是否有路由权限
 * @param roles 用户角色
 * @param route 路由
 * @returns 
 */
function hasPermission(roles: string[], route: CustomRouteRecordRaw): boolean {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta!.roles!.includes(role))
    } else {
        return true
    }
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
 * permission store模块
 */
export const usePermissionStore = defineStore('permission', () => {
    // state
    const routes = ref<CustomRouteRecordRaw[]>([])  // 所有路由
    const addRoutes = ref<CustomRouteRecordRaw[]>([])  // 动态路由

    // actions
    function setRoutes(routeValues: CustomRouteRecordRaw[]) {
        routes.value = routeValues
        addRoutes.value = constantRoutes.concat(routeValues)
    }
    function generateRoutes(roles: string[]): Promise<CustomRouteRecordRaw[]> {
        return new Promise(resolve => {
            let accessedRoutes: CustomRouteRecordRaw[]
            if (roles.includes('admin')) {
                accessedRoutes = asyncRoutes ?? []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            }
            // 404 page must be placed at the end !!!
            accessedRoutes.push({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
            setRoutes(accessedRoutes)
            resolve(accessedRoutes)
        })
    }

    return {
        routes,
        addRoutes,
        setRoutes,
        generateRoutes
    }
})