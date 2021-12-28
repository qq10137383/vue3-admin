import { ref, Ref } from 'vue'

export interface ToggleState {
    state: Ref<boolean>
    toggle(): void
}

export function useToggle(defaultValue = false): ToggleState {
    const state = ref(defaultValue)

    function toggle() {
        state.value = !state.value
    }

    return {
        state,
        toggle
    }
}