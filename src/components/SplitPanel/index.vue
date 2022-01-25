<template>
    <div
        :style="{ cursor, userSelect }"
        class="vue-splitter-container clearfix"
        @mouseup="onMouseUp"
        @mousemove="onMouseMove"
    >
        <pane
            class="splitter-pane splitter-paneL"
            :split="split"
            :style="{ [type]: percent + '%' }"
        >
            <slot name="paneL"></slot>
        </pane>

        <resizer
            :className="className"
            :style="{ [resizeType]: percent + '%' }"
            :split="split"
            @mousedown="onMouseDown"
            @click="onClick"
        ></resizer>

        <pane
            class="splitter-pane splitter-paneR"
            :split="split"
            :style="{ [type]: 100 - percent + '%' }"
        >
            <slot name="paneR"></slot>
        </pane>
        <div class="vue-splitter-container-mask" v-if="active"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import Resizer from './resizer.vue'
import Pane from './pane.vue'

const RESIZE_EVENT = 'resize'

export default defineComponent({
    name: "SplitPanel",
    components: {
        Pane,
        Resizer
    },
    props: {
        minPercent: {
            type: Number,
            default: 10
        },
        defaultPercent: {
            type: Number,
            default: 50
        },
        split: {
            type: String,
            validator: (value: string) => {
                return ['vertical', 'horizontal'].indexOf(value) >= 0
            },
            required: true
        },
        className: String
    },
    emits: [RESIZE_EVENT],
    setup(props, { emit }) {
        let hasMoved = false

        const active = ref(false)
        const percent = ref(props.defaultPercent)

        const userSelect = computed(() => {
            return active.value ? 'none' : 'auto'
        })
        const cursor = computed(() => {
            return active.value ? (props.split === 'vertical' ? 'col-resize' : 'row-resize') : ''
        })
        const type = computed(() => {
            return props.split === 'vertical' ? 'width' : 'height'
        })
        const resizeType = computed(() => {
            return props.split === 'vertical' ? 'left' : 'top'
        })

        function onClick() {
            if (!hasMoved) {
                percent.value = 50
                emit(RESIZE_EVENT, percent.value)
            }
        }
        function onMouseDown() {
            active.value = true
            hasMoved = false
        }
        function onMouseUp() {
            active.value = false
        }
        function onMouseMove(e: MouseEvent) {
            if (e.buttons === 0 || e.which === 0) {
                active.value = false
            }
            if (active.value) {
                let offset = 0
                let target = e.currentTarget as HTMLElement
                let tmp = target
                if (props.split === 'vertical') {
                    while (tmp) {
                        offset += tmp.offsetLeft
                        tmp = tmp.offsetParent as HTMLElement
                    }
                } else {
                    while (tmp) {
                        offset += tmp.offsetTop
                        tmp = tmp.offsetParent as HTMLElement
                    }
                }
                const currentPage = props.split === 'vertical' ? e.pageX : e.pageY
                const targetOffset = props.split === 'vertical' ? target.offsetWidth : target.offsetHeight
                const ratio = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100
                if (ratio > props.minPercent && ratio < 100 - props.minPercent) {
                    percent.value = ratio
                }
                emit(RESIZE_EVENT, percent.value)
                hasMoved = true
            }
        }

        return {
            active,
            percent,
            userSelect,
            cursor,
            type,
            resizeType,
            onClick,
            onMouseDown,
            onMouseMove,
            onMouseUp
        }
    },
})
</script>

<style lang="scss">
.vue-splitter-container {
    height: 100%;
    position: relative;

    &.clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .vue-splitter-container-mask {
        z-index: 9999;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>