import { Module, MutationTree, ActionTree } from "vuex"
import Cookies from 'js-cookie'

import type { AllState } from '../index'

/**
 * 设备类型
 */
export enum DeviceType {
    Desktop = "desktop",
    Mobile = "mobile"
}

/**
 * App State
 */
export type AppState = {
    sidebar: {
        opened: boolean,
        withoutAnimation: boolean
    },
    device: DeviceType,
    size: string
}

const state: AppState = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: DeviceType.Desktop,
    size: Cookies.get('size') || 'default'
}

const mutations: MutationTree<AppState> = {
    TOGGLE_SIDEBAR(state) {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', "1")
        } else {
            Cookies.set('sidebarStatus', "0")
        }
    },
    CLOSE_SIDEBAR(state, withoutAnimation: boolean) {
        Cookies.set('sidebarStatus', "0")
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE(state, device: DeviceType) {
        state.device = device
    },
    SET_SIZE(state, size: string) {
        state.size = size
        Cookies.set('size', size)
    }
}

const actions: ActionTree<AppState, AllState> = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }: AppState["sidebar"]) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device: string) {
        commit('TOGGLE_DEVICE', device)
    },
    setSize({ commit }, size: string) {
        commit('SET_SIZE', size)
    }
}

/**
 * app store模块
 */
const app: Module<AppState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default app