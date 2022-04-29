import store from "@/store"
import { useUserStore } from '@/store/modules/user'

/**
 * 检查是否有指定权限
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value: string[]): boolean {
    const userStore = useUserStore(store)
    if (value && value instanceof Array && value.length > 0) {
        const permissionRoles = value

        const hasPermission = userStore.roles.some(role => {
            return permissionRoles.includes(role)
        })
        return hasPermission
    } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
    }
}
