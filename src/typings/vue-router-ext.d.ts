import { RouteRecordRaw } from 'vue-router'

/**
 * vue-router 类型扩展
 */
declare module "vue-router" {
    // type 无法声明合并，定义一个新类型CustomRouteRecordRaw扩展RouteRecordRaw
    type CustomRouteRecordRaw = Omit<RouteRecordRaw, "children">
        & {
            children?: CustomRouteRecordRaw[]
            hidden?: boolean
            alwaysShow?: boolean
        }

    interface RouteMeta {
        roles?: string[]
        title: string
        icon?: string
        noCache?: boolean
        affix?: boolean
        breadcrumb?: boolean
        activeMenu?: string
    }

    interface RouteLocationNormalizedLoaded {
        title?: string
    }
}

export { }