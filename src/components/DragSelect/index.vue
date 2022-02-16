<template>
    <el-select ref="dragSelectRef" v-bind="$attrs" class="drag-select">
        <slot />
    </el-select>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { ElSelect } from 'element-plus'
import Sortable from 'sortablejs'

export default defineComponent({
    name: 'DragSelect',
    setup(_, { attrs }) {
        const dragSelectRef = ref<InstanceType<typeof ElSelect>>()

        let sortable: Sortable | null = null

        function setSort() {
            const el: HTMLElement = dragSelectRef.value!.$el.querySelectorAll('.el-select__tags > span')[0]
            sortable = Sortable.create(el, {
                ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
                setData: function (dataTransfer) {
                    dataTransfer.setData('Text', '')
                    // to avoid Firefox bug
                    // Detail see : https://github.com/RubaXa/Sortable/issues/1012
                },
                onEnd: evt => {
                    const selected = attrs.modelValue as any[]
                    const targetRow = selected.splice(evt.oldIndex!, 1)[0]
                    selected.splice(evt.newIndex!, 0, targetRow)
                }
            })
        }
        function getSort() {
            return sortable
        }

        onMounted(setSort)

        return {
            dragSelectRef,
            getSort
        }
    },
})
</script>


<style lang="scss" scoped>
.drag-select {
    ::v-deep(.sortable-ghost) {
        opacity: 0.8;
        color: #fff !important;
        background: #42b983 !important;
    }
    ::v-deep(.el-tag) {
        cursor: pointer;
    }
}
</style>
