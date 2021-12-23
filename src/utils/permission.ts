import store from "@/store"

/**
 * 检查是否有指定权限
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value: string[]): boolean {
    if (value && value instanceof Array && value.length > 0) {
        const roles = <string[]>(store.getters?.roles ?? [])
        const permissionRoles = value

        const hasPermission = roles.some(role => {
            return permissionRoles.includes(role)
        })
        return hasPermission
    } else {
        console.error(`need roles! Like v-permission="['admin','editor']"`)
        return false
    }
}
