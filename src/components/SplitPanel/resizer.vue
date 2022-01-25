<template>
    <div :class="classes"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        split: {
            type: String,
            validator: (value: string) => {
                return ['vertical', 'horizontal'].indexOf(value) >= 0
            },
            required: true
        },
        className: String
    },
    setup(props) {
        const classes = computed(() => {
            const classItems = ['splitter-pane-resizer', props.split, props.className]
            return classItems.join(' ')
        })

        return {
            classes
        }
    },
})
</script>

<style lang="scss">
.splitter-pane-resizer {
    box-sizing: border-box;
    background: #000;
    position: absolute;
    opacity: 0.2;
    z-index: 1;
    background-clip: padding-box;

    &.horizontal {
        height: 11px;
        margin: -5px 0;
        border-top: 5px solid rgba(255, 255, 255, 0);
        border-bottom: 5px solid rgba(255, 255, 255, 0);
        cursor: row-resize;
        width: 100%;
    }

    &.vertical {
        width: 11px;
        height: 100%;
        margin-left: -5px;
        border-left: 5px solid rgba(255, 255, 255, 0);
        border-right: 5px solid rgba(255, 255, 255, 0);
        cursor: col-resize;
    }
}
</style>
