<template>
    <div class="drawer-container">
        <div>
            <h3 class="drawer-title">Page style setting</h3>

            <div class="drawer-item">
                <span>Theme Color</span>
                <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
            </div>

            <div class="drawer-item">
                <span>Open Tags-View</span>
                <el-switch v-model="tagsView" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>Fixed Header</span>
                <el-switch v-model="fixedHeader" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>Sidebar Logo</span>
                <el-switch v-model="sidebarLogo" class="drawer-switch" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useSettingsStore } from '@/store/modules/settings'
import ThemePicker from '@/components/ThemePicker/index.vue'

export default defineComponent({
    components: {
        ThemePicker
    },
    setup() {
        const tagsViewStore = useTagsViewStore()
        const settingsStore = useSettingsStore()
        const router = useRouter()
        const route = useRoute()

        const fixedHeader = computed({
            get: () => settingsStore.fixedHeader as boolean,
            set: (val: boolean) => settingsStore.changeSetting({
                key: 'fixedHeader',
                value: val
            })
        })
        const tagsView = computed({
            get: () => settingsStore.tagsView as boolean,
            set: (val: boolean) => settingsStore.changeSetting({
                key: 'tagsView',
                value: val
            })
        })
        const sidebarLogo = computed({
            get: () => settingsStore.sidebarLogo as boolean,
            set: (val: boolean) => settingsStore.changeSetting({
                key: 'sidebarLogo',
                value: val
            })
        })

        function themeChange(val: string) {
            settingsStore.changeSetting({
                key: 'theme',
                value: val
            })
            // 清除所有页面缓存并刷新当前视图(内联样式无法更新的问题)
            tagsViewStore.delAllCachedViews().then(() => {
                const { fullPath } = route
                nextTick(() => {
                    router.replace({ path: '/redirect' + fullPath })
                })
            })
        }

        return {
            fixedHeader,
            tagsView,
            sidebarLogo,
            themeChange
        }
    },
})
</script>

<style lang="scss" scoped>
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        padding: 12px 0;
    }

    .drawer-switch {
        float: right;
    }
}
</style>
