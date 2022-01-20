<template>
    <div :class="{ 'show': show }" class="header-search">
        <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
        <el-select
            ref="headerSearchSelectRef"
            v-model="search"
            :remote-method="querySearch"
            filterable
            default-first-option
            remote
            placeholder="Search"
            class="header-search-select"
            @change="change"
        >
            <el-option
                v-for="item in options"
                :key="item.path"
                :value="item"
                :label="item.title.join(' > ')"
            />
        </el-select>
    </div>
</template>

<script lang="ts">
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue'
import { CustomRouteRecordRaw, useRouter } from 'vue-router'
import { ElSelect } from 'element-plus'
import { useGetter } from '@/hooks/use-vuex'
import { useToggle } from '@/hooks/use-toggle'

interface SearchItem {
    path: string
    title: string[]
}

export default defineComponent({
    name: "HeaderSearch",
    setup() {
        let fuse: Fuse<SearchItem> | null = null

        const headerSearchSelectRef = ref<InstanceType<typeof ElSelect>>()

        const router = useRouter()
        const search = ref('')
        const searchPool = ref<SearchItem[]>([])
        const options = ref<SearchItem[]>([])
        const { state: show, toggle } = useToggle(false)
        const { permission_routes } = useGetter(['permission_routes'])

        // Filter out the routes that can be displayed in the sidebar
        // And generate the internationalized title
        function generateRoutes(routes: CustomRouteRecordRaw[], basePath = '/', prefixTitle: string[] = []) {
            let res: SearchItem[] = []

            for (const router of routes) {
                // skip hidden router
                if (router.hidden) { continue }

                const data: SearchItem = {
                    path: path.resolve(basePath, router.path),
                    title: [...prefixTitle]
                }

                if (router.meta?.title) {
                    data.title = [...data.title, router.meta.title]

                    if (router.redirect !== 'noRedirect') {
                        // only push the routes with title
                        // special case: need to exclude parent router without redirect
                        res.push(data)
                    }
                }

                // recursive child routes
                if (router.children) {
                    const tempRoutes = generateRoutes(router.children, data.path, data.title)
                    if (tempRoutes.length >= 1) {
                        res = [...res, ...tempRoutes]
                    }
                }
            }
            return res

        }
        function setSearchPool() {
            searchPool.value = generateRoutes(permission_routes.value)
        }
        function initFuse(list: SearchItem[]) {
            fuse = new Fuse(list, {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [{
                    name: 'title',
                    weight: 0.7
                }, {
                    name: 'path',
                    weight: 0.3
                }]
            })
        }
        function click() {
            toggle()
            if (show.value) {
                headerSearchSelectRef.value?.focus()
            }
        }
        function change(val: SearchItem) {
            router.push(val.path)
            search.value = ''
            options.value = []
            nextTick(() => {
                show.value = false
            })
        }
        function querySearch(query: string) {
            if (query !== '') {
                options.value = fuse!.search(query)
            } else {
                options.value = []
            }
        }
        function close() {
            headerSearchSelectRef.value?.blur()
            options.value = []
            show.value = false
        }

        watch(() => [...permission_routes.value], setSearchPool)
        watch(() => searchPool.value, (value) => initFuse(value))
        watch(() => show.value, (value) => {
            if (value) {
                document.body.addEventListener('click', close)
            } else {
                document.body.removeEventListener('click', close)
            }
        })

        onMounted(setSearchPool)

        return {
            search,
            options,
            show,
            headerSearchSelectRef,
            click,
            change,
            querySearch
        }
    }
})
</script>


<style lang="scss" scoped>
.header-search {
    font-size: 0 !important;

    .search-icon {
        cursor: pointer;
        font-size: 18px;
        vertical-align: middle;
    }

    .header-search-select {
        font-size: 18px;
        transition: width 0.2s;
        width: 0;
        overflow: hidden;
        background: transparent;
        border-radius: 0;
        display: inline-block;
        vertical-align: middle;

        ::v-deep(.el-input__inner) {
            border-radius: 0;
            border: 0;
            padding-left: 0;
            padding-right: 0;
            box-shadow: none !important;
            border-bottom: 1px solid #d9d9d9;
            vertical-align: middle;
        }
    }

    &.show {
        .header-search-select {
            width: 210px;
            margin-left: 10px;
        }
    }
}
</style>
