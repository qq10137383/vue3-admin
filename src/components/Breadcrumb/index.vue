<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span
                    v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
                    class="no-redirect"
                >{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter, RouteLocationMatched } from 'vue-router'
import pathToRegexp from 'path-to-regexp'

type BreadItem = Pick<RouteLocationMatched, 'redirect' | 'path' | 'meta'>

export default defineComponent({
    name: "Breadcrumb",
    setup() {
        const route = useRoute()
        const router = useRouter()

        const levelList = ref<BreadItem[]>([])

        function isDashboard(location: RouteLocationMatched) {
            const name = location?.name as string
            if (!name) {
                return false
            }
            return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
        }
        function getBreadcrumb() {
            const matched = route.matched.filter(item => item.meta?.title)
            const first = matched[0]
            const tmp = levelList.value

            if (!isDashboard(first)) {
                tmp.push({ path: '/dashboard', meta: { title: 'Dashboard' }, redirect: undefined })
            }
            tmp.push(...matched)
            levelList.value = tmp.filter(item => item.meta?.title && item.meta.breadcrumb !== false)
        }
        function pathCompile(path: string) {
            // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
            const { params } = route
            var toPath = pathToRegexp.compile(path)
            return toPath(params)
        }
        function handleLink(item: BreadItem) {
            const { redirect, path } = item
            if (redirect) {
                router.push(redirect as string)
                return
            }
            router.push(pathCompile(path))
        }

        watch(route, (val) => {
            if (val.path.startsWith('/redirect/')) {
                return
            }
            getBreadcrumb()
        })

        getBreadcrumb()

        return {
            levelList,
            handleLink
        }
    },
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
