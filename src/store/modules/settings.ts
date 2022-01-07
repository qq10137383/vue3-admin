import { Module, MutationTree, ActionTree } from "vuex"
import elementVariables from '@/styles/element-variables.scss'
import type { AllState } from '../index'

import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

/**
 * Settings State
 */
export type SettignsState = {
    theme: string,
    showSettings: boolean,
    tagsView: boolean,
    fixedHeader: boolean,
    sidebarLogo: boolean
}

const state: SettignsState = {
    theme: elementVariables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
}

export type KeyPairs<T> = {
    key: keyof T,
    value: T[keyof T]
}

const mutations: MutationTree<SettignsState> = {
    CHANGE_SETTING(state, { key, value }: KeyPairs<SettignsState>) {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            (state as any)[key] = value
        }
    }
}

const actions: ActionTree<SettignsState, AllState> = {
    changeSetting({ commit }, data: KeyPairs<SettignsState>) {
        commit('CHANGE_SETTING', data)
    }
}

/**
 * 应用设置模块
 */
const settings: Module<SettignsState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default settings

