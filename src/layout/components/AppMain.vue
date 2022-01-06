<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews">
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGetter } from '@/hooks/use-vuex'

// vue-router4 router-viewer需要包裹在keep-alive外面，和vue-router3相反
// see https://next.router.vuejs.org/zh/guide/migration/index.html#router-view-%E3%80%81-keep-alive-%E5%92%8C-transition
export default defineComponent({
    name: 'AppMain',
    setup() {
        const { cachedViews } = useGetter(["cachedViews"])

        return {
            cachedViews
        }
    },
})
</script>


<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 84px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
