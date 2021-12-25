import { ComputedRef, computed } from 'vue'
import { useStore, mapState, mapGetters } from 'vuex'

function createComputedMappedFn(mappedFn: any) {
    return (...args: any): Record<string, ComputedRef> => {
        const store = useStore()
        const items = mappedFn.apply(null as any, args)
        const mapped = Object.keys(items).reduce((target, key) => {
            // 转换mapped包装函数的上下文，函数内部会调用this.$store
            const fn = items[key].bind({ $store: store })
            target[key] = computed(fn)
            return target
        }, {} as Record<string, ComputedRef>)
        return mapped
    }
}
export interface UseStateHook {
    (map: string[]): Record<string, ComputedRef>
    (namespace: string, map: string[]): Record<string, ComputedRef>
    (map: Record<string, (state: any, getters: any) => any>): Record<string, ComputedRef>
    (namespace: string, map: Record<string, (state: any, getters: any) => any>): Record<string, ComputedRef>
}
export const useState: UseStateHook = createComputedMappedFn(mapState)

export type UseGetterHook = UseStateHook
export const useGetter: UseGetterHook = createComputedMappedFn(mapGetters)

