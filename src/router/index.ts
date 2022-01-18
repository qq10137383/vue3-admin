import { createRouter, createWebHistory, CustomRouteRecordRaw, RouteRecordRaw, Router } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar，el-icon component should regist in @/utils/el-icons.ts
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes: CustomRouteRecordRaw[] = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import("@/views/login/index.vue"),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect.vue'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
            }
        ]
    },
    {
        path: '/documentation',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('@/views/documentation/index.vue'),
                name: 'Documentation',
                meta: { title: 'Documentation', icon: 'documentation', affix: true }
            }
        ]
    },
    {
        path: '/guide',
        component: Layout,
        redirect: '/guide/index',
        children: [
            {
                path: 'index',
                component: () => import('@/views/guide/index.vue'),
                name: 'Guide',
                meta: { title: 'Guide', icon: 'guide', noCache: true }
            }
        ]
    },
]

export const asyncRoutes: CustomRouteRecordRaw[] = [
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        children: [
            {
                path: 'index',
                name: "Profile",
                component: () => import("@/views/profile/index.vue"),
                meta: { title: 'Profile', icon: 'el-icon-apple' }
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes as RouteRecordRaw[]
})


type RouteRemoveHandler = ReturnType<Router["addRoute"]>

// 动态路由移除方法，通过addRoute增加的动态路由在退出时要清理
let asyncRemoveHandlers: RouteRemoveHandler[] = []

export function addRoute(route: CustomRouteRecordRaw): RouteRemoveHandler {
    const handler = router.addRoute(route as RouteRecordRaw)
    asyncRemoveHandlers.push(handler)
    return handler
}

// 1、matcher在vue3中作为函数内部变量无法访问，addRoute方法返回值为移除路由方法
//    see https://github.com/vuejs/vue-router-next/issues/1237
// 2、虽然使用router.remoteRoute可以移除路由，但是方法需要移除的路由有name属性，
//    系统中的路由可以没有name，所以使用addRouter的返回值作为替代
export function resetRouter(): void {
    asyncRemoveHandlers.forEach(fn => fn())
    asyncRemoveHandlers = []
}

export default router