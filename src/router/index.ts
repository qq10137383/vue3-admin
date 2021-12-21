import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Dashboard from "@/views/dashboard/index.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component: Dashboard
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router