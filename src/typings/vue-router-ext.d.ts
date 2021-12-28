import type { RouteRecordRaw } from "vue-router"

/**
 * vue-router增加类型CustomRouteRecordRaw，继承自RouteRecordRaw，
 * 增加hidden属性
 */
declare module "vue-router" {
    type CustomRouteRecordRaw = Omit<RouteRecordRaw, "children">
        & {
            children?: CustomRouteRecordRaw[]
            hidden?: boolean
        }
}

export { }