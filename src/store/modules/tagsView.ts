import { CustomRouteRecordRaw } from "vue-router"
import { ActionTree, Module, MutationTree } from "vuex"

import type { AllState } from "../index"

/**
 * 页签 State
 */
export type TagsViewState = {
    /**
     * 已访问的视图路由集合
     */
    visitedViews: CustomRouteRecordRaw[],
    /**
     * 已缓存的视图路由名集合
     */
    cachedViews: string[]
}

const state: TagsViewState = {
    visitedViews: [],
    cachedViews: []
}

const mutations: MutationTree<TagsViewState> = {
    ADD_VISITED_VIEW(state, view: CustomRouteRecordRaw) {
        if (state.visitedViews.some(v => v.path === view.path)) return
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta?.title ?? 'no-name'
            })
        )
    },
    ADD_CACHED_VIEW(state, view: CustomRouteRecordRaw) {
        const viewName = <string>view.name
        if (state.cachedViews.includes(viewName)) return
        if (!view.meta?.noCache) {
            state.cachedViews.push(viewName)
        }
    },
    DEL_VISITED_VIEW(state, view: CustomRouteRecordRaw) {
        for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
                state.visitedViews.splice(i, 1)
                break
            }
        }
    },
    DEL_CACHED_VIEW(state, view: CustomRouteRecordRaw) {
        const index = state.cachedViews.indexOf(<string>view.name)
        index > -1 && state.cachedViews.splice(index, 1)
    },
    DEL_OTHERS_CACHED_VIEWS(state, view: CustomRouteRecordRaw) {
        const index = state.cachedViews.indexOf(<string>view.name)
        if (index > -1) {
            state.cachedViews = state.cachedViews.slice(index, index + 1)
        } else {
            // if index = -1, there is no cached tags
            state.cachedViews = []
        }
    },
    DEL_ALL_VISITED_VIEWS(state) {
        // keep affix tags
        const affixTags = state.visitedViews.filter(tag => tag.meta?.affix)
        state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS(state) {
        state.cachedViews = []
    },
    UPDATE_VISITED_VIEW(state, view: CustomRouteRecordRaw) {
        for (let v of state.visitedViews) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    }
}

const actions: ActionTree<TagsViewState, AllState> = {
    addView({ dispatch }, view: CustomRouteRecordRaw) {
        dispatch('addVisitedView', view)
        dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view: CustomRouteRecordRaw) {
        commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view: CustomRouteRecordRaw) {
        commit('ADD_CACHED_VIEW', view)
    },
    delView({ dispatch, state }, view: CustomRouteRecordRaw): Promise<TagsViewState> {
        return new Promise(resolve => {
            dispatch('delVisitedView', view)
            dispatch('delCachedView', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delVisitedView({ commit, state }, view: CustomRouteRecordRaw): Promise<CustomRouteRecordRaw[]> {
        return new Promise(resolve => {
            commit('DEL_VISITED_VIEW', view)
            resolve([...state.visitedViews])
        })
    },
    delCachedView({ commit, state }, view: CustomRouteRecordRaw): Promise<string[]> {
        return new Promise(resolve => {
            commit('DEL_CACHED_VIEW', view)
            resolve([...state.cachedViews])
        })
    },
    delOthersViews({ dispatch, state }, view: CustomRouteRecordRaw): Promise<TagsViewState> {
        return new Promise(resolve => {
            dispatch('delOthersVisitedViews', view)
            dispatch('delOthersCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delOthersVisitedViews({ commit, state }, view: CustomRouteRecordRaw): Promise<CustomRouteRecordRaw[]> {
        return new Promise(resolve => {
            commit('DEL_OTHERS_VISITED_VIEWS', view)
            resolve([...state.visitedViews])
        })
    },
    delOthersCachedViews({ commit, state }, view: CustomRouteRecordRaw): Promise<string[]> {
        return new Promise(resolve => {
            commit('DEL_OTHERS_CACHED_VIEWS', view)
            resolve([...state.cachedViews])
        })
    },
    delAllViews({ dispatch, state }, view: CustomRouteRecordRaw): Promise<TagsViewState> {
        return new Promise(resolve => {
            dispatch('delAllVisitedViews', view)
            dispatch('delAllCachedViews', view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            })
        })
    },
    delAllVisitedViews({ commit, state }): Promise<CustomRouteRecordRaw[]> {
        return new Promise(resolve => {
            commit('DEL_ALL_VISITED_VIEWS')
            resolve([...state.visitedViews])
        })
    },
    delAllCachedViews({ commit, state }): Promise<string[]> {
        return new Promise(resolve => {
            commit('DEL_ALL_CACHED_VIEWS')
            resolve([...state.cachedViews])
        })
    },
    updateVisitedView({ commit }, view) {
        commit('UPDATE_VISITED_VIEW', view)
    }
}

const tagsView: Module<TagsViewState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default tagsView