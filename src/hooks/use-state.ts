import { ComputedRef } from 'vue'
import { useStore, mapState, Mapper, MapperWithNamespace } from 'vuex'

export type UseStateFn = Mapper<ComputedRef>
    & MapperWithNamespace<ComputedRef>

export const useState: UseStateFn = (...args: any): any => {
    const store = useStore()
    mapState.apply(store, args)
}
