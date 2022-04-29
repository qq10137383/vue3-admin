<template>
    <div v-if="!item.hidden">
        <template
            v-if="hasOneShowingChild(item.children, item)
            && (!onlyOneChild?.children || onlyOneChild.noShowingChildren)
            && !item.alwaysShow"
        >
            <app-link v-if="onlyOneChild?.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item
                    :index="resolvePath(onlyOneChild.path)"
                    :class="{ 'submenu-title-noDropdown': !isNest }"
                >
                    <menu-icon :icon="onlyOneChild.meta.icon || (item.meta?.icon)" />
                    <template v-slot:title>
                        <span>{{ onlyOneChild.meta.title }}</span>
                    </template>
                </el-menu-item>
            </app-link>
        </template>

        <el-sub-menu v-else ref="subMenuRef" :index="resolvePath(item.path)" popper-append-to-body>
            <template v-slot:title>
                <menu-icon :icon="item.meta?.icon" />
                <span>{{ item.meta?.title }}</span>
            </template>
            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script lang="ts">
import path from 'path'
import { defineComponent, onMounted, PropType, ref } from 'vue'
import type { CustomRouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { isExternal } from '@/utils/validate'
import MenuIcon from './Icon.vue'
import AppLink from './Link.vue'
import { useAppStore } from '@/store/modules/app'

export default defineComponent({
    components: {
        MenuIcon,
        AppLink
    },
    props: {
        // route object
        item: {
            type: Object as PropType<CustomRouteRecordRaw>,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const onlyOneChild = ref<CustomRouteRecordRaw>()

        const appStore = useAppStore()
        const { device } = storeToRefs(appStore)

        const subMenuRef = ref<any>()

        function hasOneShowingChild(children: CustomRouteRecordRaw[] = [], parent: CustomRouteRecordRaw) {
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false
                } else {
                    // Temp set(will be used if only has one showing child)
                    onlyOneChild.value = item
                    return true
                }
            })

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
                return true
            }

            return false
        }
        function resolvePath(routePath: string) {
            if (isExternal(routePath)) {
                return routePath
            }
            if (isExternal(props.basePath)) {
                return props.basePath
            }
            return path.resolve(props.basePath, routePath)
        }
        function fixBugIniOS() {
            if (subMenuRef.value) {
                // handleMouseleave为el-sub-menu组件内部方法未暴露出来
                const handleMouseleave = subMenuRef.value.handleMouseleave
                subMenuRef.value.handleMouseleave = (e: boolean) => {
                    if (device.value === 'mobile') {
                        return
                    }
                    handleMouseleave(e)
                }
            }
        }

        onMounted(fixBugIniOS)

        return {
            onlyOneChild,
            hasOneShowingChild,
            resolvePath,
            subMenuRef
        }
    },
})
</script>
