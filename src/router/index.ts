import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Dashboard from "@/views/dashboard/index.vue";

export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import("@/views/login/index.vue"),
    },
    {
        path: "/",
        name: "Dashboard",
        component: Dashboard
    }
]

export const asyncRoutes: RouteRecordRaw[] = [

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes
})

export function resetRouter(): void {
    const routes = router.getRoutes()
    routes.forEach(r => r.name && router.removeRoute(r.name))
}

export default router