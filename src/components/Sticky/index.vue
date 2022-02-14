<template>
    <div ref="elRef" :style="{ height: height + 'px', zIndex: zIndex }">
        <div
            :class="className"
            :style="{
                top: isSticky ? stickyTop + 'px' : undefined,
                zIndex: zIndex,
                position: position,
                width: width,
                height: height + 'px'
            }"
        >
            <slot>
                <div>sticky</div>
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted, onBeforeUnmount } from 'vue'
import * as CSS from 'csstype'

/**
 * 粘性布局组件，现代浏览器可以使用样式position: sticky代替
 */
export default defineComponent({
    name: 'Sticky',
    props: {
        stickyTop: {
            type: Number,
            default: 0
        },
        zIndex: {
            type: Number,
            default: 1
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const elRef = ref<HTMLElement>()
        const state = reactive<{
            position?: CSS.PositionProperty,
            width?: CSS.WidthProperty<string | number>,
            height?: CSS.HeightProperty<string | number>,
            isSticky: boolean
        }>({
            position: undefined,
            width: undefined,
            height: undefined,
            isSticky: false
        })

        function sticky() {
            if (state.isSticky) {
                return
            }
            state.position = 'fixed'
            state.width = state.width + 'px'
            state.isSticky = true
        }
        function reset() {
            state.position = undefined
            state.width = 'auto'
            state.isSticky = false
        }
        function handleReset() {
            if (!state.isSticky) {
                return
            }
            reset()
        }
        function handleScroll() {
            const { width, top } = elRef.value!.getBoundingClientRect()
            state.width = width || 'auto'
            // 超过粘性布局高度就将布局转为fixed
            if (top < props.stickyTop) {
                sticky()
                return
            }
            handleReset()
        }
        function handleResize() {
            if (state.isSticky) {
                state.width = elRef.value!.getBoundingClientRect().width + 'px'
            }
        }

        onMounted(() => {
            // fixed布局时需要设置元素宽度、高度
            state.height = elRef.value!.getBoundingClientRect().height
            window.addEventListener('scroll', handleScroll)
            window.addEventListener('resize', handleResize)
        })
        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleReset)
            window.removeEventListener('resize', handleResize)
        })

        return {
            elRef,
            ...toRefs(state)
        }
    },
})
</script>

