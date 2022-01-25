<template>
    <div :class="classes">
        <slot></slot>
    </div>
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
            const classItems = [props.split, props.className]
            return classItems.join(' ')
        })

        return {
            classes
        }
    },
})
</script>

<style lang="scss">
.splitter-pane {
    &.vertical {
        &.splitter-paneL {
            position: absolute;
            left: 0px;
            height: 100%;
            padding-right: 3px;
        }
        &.splitter-paneR {
            position: absolute;
            right: 0px;
            height: 100%;
            padding-left: 3px;
        }
    }

    &.horizontal {
        &.splitter-paneL {
            position: absolute;
            top: 0px;
            width: 100%;
        }
        &.splitter-paneR {
            position: absolute;
            bottom: 0px;
            width: 100%;
            padding-top: 3px;
        }
    }
}
</style>
