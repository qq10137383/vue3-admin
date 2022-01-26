import { ref, computed, ComputedRef } from 'vue'

export interface UseStep {
    current: ComputedRef<number>
    next(): boolean
    previous(): boolean
    step(index: number): boolean
    reset(): void
}

export function useStep(initIndex = 1, min = 1, max?: number): UseStep {
    const state = ref(initIndex)

    // 只读属性
    const current = computed(() => state.value)

    function step(index: number) {
        index = Math.max(index, min)
        if (max !== undefined) {
            index = Math.min(index, max)
        }
        const result = index != state.value
        state.value = index
        return result
    }
    function next() {
        return step(state.value + 1)
    }
    function previous() {
        return step(state.value - 1)
    }
    function reset() {
        state.value = initIndex
    }

    return {
        current,
        step,
        next,
        previous,
        reset
    }
}