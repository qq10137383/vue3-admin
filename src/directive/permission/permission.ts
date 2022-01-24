import { ObjectDirective, Plugin } from 'vue'
import store from '@/store'

const permission: ObjectDirective<HTMLElement, string[]> & Partial<Plugin> = {
    mounted(el, binding) {
        const { value } = binding

        const roles: string[] = store.getters?.roles

        if (value && value instanceof Array) {
            if (value.length > 0) {
                const permissionRoles = value

                const hasPermission = roles.some(role => {
                    return permissionRoles.includes(role)
                })

                if (!hasPermission) {
                    el.parentNode?.removeChild(el)
                }
            }
        } else {
            throw new Error(`need roles! Like v-permission="['admin','editor']"`)
        }
    }
}

export default permission