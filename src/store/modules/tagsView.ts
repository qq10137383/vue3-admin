import { reactive, toRefs } from 'vue'
import { defineStore } from "pinia"
import { RouteLocationNormalizedLoaded } from "vue-router"

/**
 * 页签 State
 */
export type TagsViewState = {
    /**
     * 已访问的视图路由集合
     */
    visitedViews: RouteLocationNormalizedLoaded[],
    /**
     * 已缓存的视图路由名集合
     */
    cachedViews: string[]
}

/**
 * 页签模块
 */
export const useTagsViewStore = defineStore('tagsView', () => {
    // state
    const state = reactive<TagsViewState>({
        visitedViews: [],
        cachedViews: []
    })

    // actions 
    function addVisitedView(view: RouteLocationNormalizedLoaded) {
        if (state.visitedViews.some(v => v.path === view.path)) return
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta?.title ?? 'no-name'
            })
        )
    }
    function addCachedView(view: RouteLocationNormalizedLoaded) {
        const viewName = view.name as string
        if (state.cachedViews.includes(viewName)) return
        if (!view.meta?.noCache) {
            state.cachedViews.push(viewName)
        }
    }
    function addView(view: RouteLocationNormalizedLoaded) {
        addVisitedView(view)
        addCachedView(view)
    }
    function delVisitedView(view: RouteLocationNormalizedLoaded): Promise<RouteLocationNormalizedLoaded[]> {
        return new Promise(resolve => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
            resolve([...state.visitedViews] as RouteLocationNormalizedLoaded[])
        })
    }
    function delCachedView(view: RouteLocationNormalizedLoaded): Promise<string[]> {
        return new Promise(resolve => {
            const index = state.cachedViews.indexOf(view.name as string)
            index > -1 && state.cachedViews.splice(index, 1)
            resolve([...state.cachedViews])
        })
    }
    function delView(view: RouteLocationNormalizedLoaded): Promise<TagsViewState> {
        return new Promise(resolve => {
            delVisitedView(view)
            delCachedView(view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            } as TagsViewState)
        })
    }
    function delOthersVisitedViews(view: RouteLocationNormalizedLoaded): Promise<RouteLocationNormalizedLoaded[]> {
        return new Promise(resolve => {
            state.visitedViews = state.visitedViews.filter(v => {
                return v.meta.affix || v.path === view.path
            })
            resolve([...state.visitedViews] as RouteLocationNormalizedLoaded[])
        })
    }
    function delOthersCachedViews(view: RouteLocationNormalizedLoaded): Promise<string[]> {
        return new Promise(resolve => {
            const index = state.cachedViews.indexOf(view.name as string)
            if (index > -1) {
                state.cachedViews = state.cachedViews.slice(index, index + 1)
            } else {
                // if index = -1, there is no cached tags
                state.cachedViews = []
            }
            resolve([...state.cachedViews])
        })
    }
    function delOthersViews(view: RouteLocationNormalizedLoaded): Promise<TagsViewState> {
        return new Promise(resolve => {
            delOthersVisitedViews(view)
            delOthersCachedViews(view)
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            } as TagsViewState)
        })
    }
    function delAllVisitedViews(): Promise<RouteLocationNormalizedLoaded[]> {
        return new Promise(resolve => {
            const affixTags = state.visitedViews.filter(tag => tag.meta?.affix)
            state.visitedViews = affixTags
            resolve([...state.visitedViews] as RouteLocationNormalizedLoaded[])
        })
    }
    function delAllCachedViews(): Promise<string[]> {
        return new Promise(resolve => {
            state.cachedViews = []
            resolve([...state.cachedViews])
        })
    }
    function delAllViews(): Promise<TagsViewState> {
        return new Promise(resolve => {
            delAllVisitedViews()
            delAllCachedViews()
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            } as TagsViewState)
        })
    }
    function updateVisitedView(view: RouteLocationNormalizedLoaded) {
        for (let v of state.visitedViews) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    }

    return {
        ...toRefs(state),
        addView,
        addVisitedView,
        addCachedView,
        delView,
        delVisitedView,
        delCachedView,
        delOthersViews,
        delOthersVisitedViews,
        delOthersCachedViews,
        delAllViews,
        delAllVisitedViews,
        delAllCachedViews,
        updateVisitedView
    }
})
