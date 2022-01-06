<template>
    <div ref="elRef" id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                :ref="setTagRef"
                :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                tag="span"
                class="tags-view-item"
                @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                @contextmenu.prevent="openMenu(tag, $event)"
            >
                {{ tag.title }}
                <span
                    v-if="!isAffix(tag)"
                    class="el-icon-close"
                    @click.prevent.stop="closeSelectedTag(tag)"
                ></span>
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
            <li v-if="!isAffix(selectedTag!)" @click="closeSelectedTag(selectedTag)">Close</li>
            <li @click="closeOthersTags">Close Others</li>
            <li @click="closeAllTags(selectedTag)">Close All</li>
        </ul>
    </div>
</template>

<script lang="ts">
import path from 'path'
import {
    defineComponent, reactive, ref, toRefs, onBeforeUpdate,
    onMounted, nextTick, watch, ComponentPublicInstance
} from 'vue'
import {
    useRoute, useRouter, RouteLocationNormalizedLoaded,
    CustomRouteRecordRaw, RouteLocationRaw, RouterLinkProps
} from 'vue-router'
import { useStore } from 'vuex'
import { useState, useGetter } from '@/hooks/use-vuex'
import ScrollPane from './ScrollPane.vue'

// 自定义RouteLink，修改to属性
export type CustomRouteLink = ComponentPublicInstance<
    Omit<RouterLinkProps, 'to'> & {
        to: Pick<RouteLocationNormalizedLoaded, 'path' | 'query' | 'fullPath'>
    }
>

export default defineComponent({
    name: 'TagsView',
    components: {
        ScrollPane
    },
    setup() {
        let affixTags: RouteLocationNormalizedLoaded[] = []

        const elRef = ref<HTMLElement | null>(null)
        const scrollPaneRef = ref<InstanceType<typeof ScrollPane> | null>(null)
        let tagRefs: CustomRouteLink[] = []

        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { visitedViews } = useGetter(['visitedViews'])
        const { routes } = useState('permission', ['routes'])

        const ctxState = reactive({
            visible: false,
            top: 0,
            left: 0,
            selectedTag: {} as RouteLocationNormalizedLoaded
        })

        function setTagRef(inst: CustomRouteLink) {
            if (inst && !tagRefs.includes(inst)) {
                tagRefs.push(inst)
            }
        }
        function isActive(tag: RouteLocationNormalizedLoaded) {
            return tag.path === route.path
        }
        function isAffix(tag: RouteLocationNormalizedLoaded) {
            return tag.meta?.affix
        }
        function filterAffixTags(routes: CustomRouteRecordRaw[], basePath = '/') {
            let tags: RouteLocationNormalizedLoaded[] = []
            routes.forEach(route => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path)
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta },
                        matched: [],
                        query: {},
                        params: {},
                        hash: '',
                        redirectedFrom: undefined
                    })
                }
                if (route.children) {
                    const tempTags = filterAffixTags(route.children, route.path)
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags]
                    }
                }
            })
            return tags
        }
        function initTags() {
            affixTags = filterAffixTags(routes.value)
            for (const tag of affixTags) {
                // Must have tag name
                if (tag.name) {
                    store.dispatch('tagsView/addVisitedView', tag)
                }
            }
        }
        function addTags() {
            const { name } = route
            if (name) {
                store.dispatch('tagsView/addView', route)
            }
            return false
        }
        function moveToCurrentTag() {
            nextTick(() => {
                for (const tag of tagRefs) {
                    if (tag.to.path === route.path) {
                        scrollPaneRef.value!.moveToTarget(tag)
                        // when query is different then update
                        if (tag.to.fullPath !== route.fullPath) {
                            store.dispatch('tagsView/updateVisitedView', route)
                        }
                        break
                    }
                }
            })
        }
        function refreshSelectedTag(view: RouteLocationNormalizedLoaded) {
            store.dispatch('tagsView/delCachedView', view).then(() => {
                const { fullPath } = view
                nextTick(() => {
                    router.replace({
                        path: '/redirect' + fullPath
                    })
                })
            })
        }
        function toLastView(visitedViews: RouteLocationNormalizedLoaded[], view: RouteLocationNormalizedLoaded) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
                router.push(latestView.fullPath)
            } else {
                // now the default is to redirect to the home page if there is no tags-view,
                // you can adjust it according to your needs.
                if (view.name === 'Dashboard') {
                    // to reload home page
                    router.replace({ path: '/redirect' + view.fullPath })
                } else {
                    router.push('/')
                }
            }
        }
        function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
            store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
                if (isActive(view)) {
                    toLastView(visitedViews, view)
                }
            })
        }
        function closeOthersTags() {
            router.push(ctxState.selectedTag as RouteLocationRaw)
            store.dispatch('tagsView/delOthersViews', ctxState.selectedTag).then(() => {
                moveToCurrentTag()
            })
        }
        function closeAllTags(view: RouteLocationNormalizedLoaded) {
            store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
                if (affixTags.some(tag => tag.path === view.path)) {
                    return
                }
                toLastView(visitedViews, view)
            })
        }
        function openMenu(tag: RouteLocationNormalizedLoaded, e: MouseEvent) {
            const menuMinWidth = 105
            const el = elRef.value!
            const offsetLeft = el.getBoundingClientRect().left // container margin left
            const offsetWidth = el.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            const left = e.clientX - offsetLeft + 15 // 15: margin right

            if (left > maxLeft) {
                ctxState.left = maxLeft
            } else {
                ctxState.left = left
            }

            ctxState.top = e.clientY
            ctxState.visible = true
            ctxState.selectedTag = tag
        }
        function closeMenu() {
            ctxState.visible = false
        }

        watch(route, () => {
            addTags()
            moveToCurrentTag()
        })
        watch(() => ctxState.visible, (value) => {
            if (value) {
                document.body.addEventListener('click', closeMenu)
            } else {
                document.body.removeEventListener('click', closeMenu)
            }
        })

        onBeforeUpdate(() => {
            tagRefs = []
        })
        onMounted(() => {
            initTags()
            addTags()
        })

        return {
            elRef,
            scrollPaneRef,
            tagRefs,
            visitedViews,
            ...toRefs(ctxState),
            setTagRef,
            isActive,
            isAffix,
            refreshSelectedTag,
            closeSelectedTag,
            closeOthersTags,
            closeAllTags,
            openMenu
        }
    },
})
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;
            &:first-of-type {
                margin-left: 15px;
            }
            &:last-of-type {
                margin-right: 15px;
            }
            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;
                &::before {
                    content: "";
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(0.6);
                display: inline-block;
                vertical-align: -3px;
            }
            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
