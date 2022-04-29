import { reactive, toRefs } from 'vue'
import { defineStore } from "pinia"
import elementVariables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

export type KeyPairs<T> = {
    key: keyof T,
    value: T[keyof T]
}

/**
 * 应用设置模块
 */
export const useSettingsStore = defineStore('settings', () => {
    // state
    const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings
    const state = reactive({
        theme: elementVariables.theme,
        showSettings: showSettings,
        tagsView: tagsView,
        fixedHeader: fixedHeader,
        sidebarLogo: sidebarLogo
    })

    // actions 
    function changeSetting({ key, value }: KeyPairs<typeof state>) {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            (state as any)[key] = value
        }
    }

    return {
        ...toRefs(state),
        changeSetting
    }
})

