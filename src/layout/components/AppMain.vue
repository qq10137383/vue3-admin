<template>
    <section class="app-main">
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews">
                    <component :key="key" :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

// vue-router4 router-viewer需要包裹在keep-alive外面，和vue-router3相反
// see https://next.router.vuejs.org/zh/guide/migration/index.html#router-view-%E3%80%81-keep-alive-%E5%92%8C-transition
export default defineComponent({
    name: 'AppMain',
    setup() {
        const store = useStore();
        const route = useRoute();

        // 不能直接使用cachedViews，需要将cachedViews展开，否则会出现切换路由时组件销毁
        // see https://github.com/vuejs/vue-next/issues/5217
        const cachedViews = computed(() => [...store.getters.cachedViews])

        // 1、keep-alive默认使用组件定义(options)作为key，当组件有多个实例
        //    时就会出现多个实例共享一份缓存，自定义key能解决这个问题
        // 2、由于include使用name作为检测条件，关闭页签时如果一个组件有多个实例，所有实例
        //    的缓存都会失效，vue3这个问题在dev以外的模式暂时不能解决。
        //    see https://github.com/vuejs/vue-next/issues/2077
        const key = computed(() => route.path)

        return {
            cachedViews,
            key
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
