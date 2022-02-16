<template>
    <div class="components-container">
        <aside>
            drag-list base on
            <a
                href="https://github.com/SortableJS/vue.draggable.next"
                target="_blank"
            >vue.draggable.next</a>
        </aside>
        <div class="editor-container">
            <dnd-list :list1="list1" :list2="list2" list1-title="List" list2-title="Article pool" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DndList from '@/components/DndList/index.vue'
import { Article, fetchList } from '@/api/article'

export default defineComponent({
    components: {
        DndList
    },
    setup() {
        const list1 = ref<Article[]>()
        const list2 = ref<Article[]>()

        function getData() {
            fetchList().then(response => {
                list1.value = response.data.items.splice(0, 5)
                list2.value = response.data.items
            })
        }
        
        getData()

        return {
            list1,
            list2
        }
    },
})
</script>
