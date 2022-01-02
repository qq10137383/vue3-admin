<template>
    <div :class="{ 'has-logo': showLogo }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="route in permission_routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useState, useGetter } from '@/hooks/use-vuex'
import variables from '@/styles/variables.scss'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

export default defineComponent({
    name: 'Sidebar',
    components: {
        Logo,
        SidebarItem
    },
    setup() {
        const route = useRoute()
        const { permission_routes, sidebar } = useGetter(['permission_routes', 'sidebar'])
        const { sidebarLogo: showLogo } = useState('settings', ['sidebarLogo'])

        const activeMenu = computed(() => {
            const { meta, path } = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        })
        const isCollapse = computed(() => !sidebar.value.opened)

        return {
            variables,
            permission_routes,
            showLogo,
            activeMenu,
            isCollapse
        }
    }
})
</script>
