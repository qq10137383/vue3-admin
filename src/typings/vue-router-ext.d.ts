/**
 * vue-router 类型扩展
 */
declare module "vue-router" {
    // 扩展RouteRecordRaw
    interface _RouteRecordBase {
        // 路由是否在菜单显示
        hidden?: boolean
        // 路由没有子路由时是否总是在菜单显示
        alwaysShow?: boolean,
        // 不显示子元素
        noShowingChildren?: boolean
    }

    interface RouteMeta {
        // 允许使用路由角色列表
        roles?: string[]
        // 路由在菜单显示的标题
        title: string
        // 路由在菜单显示的图标
        icon?: string
        // 路由组件是否在keep-alive中缓存
        noCache?: boolean
        // 路由组件是否在页签中固定不可删除
        affix?: boolean
        // 路由是否显示在面包屑上
        breadcrumb?: boolean
        // 路由激活时对应的菜单项
        activeMenu?: string
    }

    interface RouteLocationNormalizedLoaded {
        title?: string
    }
}

export { }