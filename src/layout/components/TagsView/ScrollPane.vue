<template>
    <el-scrollbar
        ref="scrollContainerRef"
        :vertical="false"
        class="scroll-container"
        @wheel.prevent="handleScroll"
    >
        <slot></slot>
    </el-scrollbar>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onBeforeUnmount, onMounted, getCurrentInstance } from 'vue'
import { ElScrollbar } from 'element-plus'
import type { CustomRouteLink } from './index.vue'
import TagsView from './index.vue'

const tagAndTagSpacing = 4 // tagAndTagSpacing

const SCROLL_EVENT = 'scroll'

export default defineComponent({
    name: 'ScrollPane',
    setup(_, { emit }) {
        const instance = getCurrentInstance()

        const scrollContainerRef = ref<InstanceType<typeof ElScrollbar> | null>(null)

        const scrollWrapper = computed(() => scrollContainerRef.value?.$refs.wrap$ as HTMLElement | null)

        function handleScroll(e: WheelEvent) {
            // 有些浏览器(IE)wheelDelta值可能不存在，滚动行为默认是滚动3行(deltaY)，行高40px，
            // 兼容处理: wheelDelta = -e.deltaY * 40 = 120
            const eventDelta = (e as any).wheelDelta ?? -e.deltaY * 40
            const $scrollWrapper = scrollWrapper.value!
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
        }
        function moveToTarget(currentTag: CustomRouteLink): void {
            const $container = scrollContainerRef.value!.$el
            const $containerWidth = $container.offsetWidth
            const $scrollWrapper = scrollWrapper.value!
            const tagList = (instance!.proxy!.$parent! as InstanceType<typeof TagsView>).tagRefs

            let firstTag = null
            let lastTag = null

            // find first tag and last tag
            if (tagList.length > 0) {
                firstTag = tagList[0]
                lastTag = tagList[tagList.length - 1]
            }

            if (firstTag === currentTag) {
                $scrollWrapper.scrollLeft = 0
            } else if (lastTag === currentTag) {
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
            } else {
                // find preTag and nextTag
                const currentIndex = tagList.findIndex(item => item === currentTag)
                const prevTag = tagList[currentIndex - 1].$el as HTMLElement
                const nextTag = tagList[currentIndex + 1].$el as HTMLElement

                // the tag's offsetLeft after of nextTag
                const afterNextTagOffsetLeft = prevTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing

                // the tag's offsetLeft before of prevTag
                const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing

                if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
                    $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
                } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
                    $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
                }
            }
        }
        function emitScroll() {
            emit(SCROLL_EVENT)
        }

        onMounted(() => {
            scrollWrapper.value!.addEventListener('scroll', emitScroll, true)
        })
        onBeforeUnmount(() => {
            scrollWrapper.value!.removeEventListener('scroll', emitScroll)
        })

        return {
            scrollContainerRef,
            handleScroll,
            moveToTarget
        }
    },
})
</script>

<style lang="scss" scoped>
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;

    ::v-deep(.el-scrollbar__bar) {
        bottom: 0px;
    }

    ::v-deep(.el-scrollbar__wrap) {
        height: 49px;
    }
}
</style>
