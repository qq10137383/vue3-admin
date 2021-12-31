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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElScrollbar } from 'element-plus'

const SCROLL_EVENT = 'scroll'

export default defineComponent({
    name: 'ScrollPane',
    setup(_, { emit }) {

        const scrollContainerRef = ref<InstanceType<typeof ElScrollbar> | null>(null)

        const scrollWrapper = computed(() => scrollContainerRef.value?.$refs.wrap as HTMLElement | null)

        function handleScroll(e: WheelEvent) {
            // 有些浏览器(IE)wheelDelta值可能不存在，滚动行为默认是滚动3行(deltaY)，行高40px，
            // 兼容处理: wheelDelta = -e.deltaY * 40 = 120
            const eventDelta = (e as any).wheelDelta ?? -e.deltaY * 40
            const $scrollWrapper = scrollWrapper.value!
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
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
            handleScroll
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
