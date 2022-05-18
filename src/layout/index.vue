<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container" />
        <div :class="{ hasTagsView: needTagsView }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tags-view v-if="needTagsView" />
            </div>
            <app-main />
            <right-panel v-if="showSettings">
                <settings />
            </right-panel>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, computed } from 'vue'
import { storeToRefs } from 'pinia'
import resizeHandler from './resize-handler'
import RightPanel from '@/components/RightPanel/index.vue'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'

export default defineComponent({
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        Settings,
        RightPanel,
        Sidebar,
        TagsView
    },
    setup() {
        const appStore = useAppStore()
        const settingsStore = useSettingsStore()
        const { sidebar, device } = storeToRefs(appStore)
        const { showSettings, tagsView: needTagsView, fixedHeader } = storeToRefs(settingsStore)

        const classObj = computed(() => {
            return {
                hideSidebar: !sidebar.value.opened,
                openSidebar: sidebar.value.opened,
                withoutAnimation: sidebar.value.withoutAnimation,
                mobile: device.value === 'mobile'
            }
        })

        function handleClickOutside() {
            appStore.closeSideBar(false)
        }

        resizeHandler()

        return {
            sidebar,
            device,
            showSettings,
            needTagsView,
            fixedHeader,
            classObj,
            handleClickOutside
        }
    }
})

</script>

<style lang="scss" scoped>
@use "~@/styles/mixin.scss" as *;
@use "~@/styles/variables.scss" as *;

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}
</style>
