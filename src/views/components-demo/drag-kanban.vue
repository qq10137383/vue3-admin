<template>
    <div class="components-container board">
        <Kanban
            :key="1"
            :list="list1"
            :group="group"
            item-key="id"
            class="kanban todo"
            header-text="Todo"
        />
        <Kanban
            :key="2"
            :list="list2"
            :group="group"
            item-key="id"
            class="kanban working"
            header-text="Working"
        />
        <Kanban
            :key="3"
            :list="list3"
            :group="group"
            item-key="id"
            class="kanban done"
            header-text="Done"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Kanban from '@/components/Kanban/index.vue'

interface ListItem {
    id: number
    name: string
}

export default defineComponent({
    name: 'DragKanbanDemo',
    components: {
        Kanban
    },
    setup() {
        const group = ref('mission')
        const list1 = ref<ListItem[]>([
            { name: 'Mission', id: 1 },
            { name: 'Mission', id: 2 },
            { name: 'Mission', id: 3 },
            { name: 'Mission', id: 4 }
        ])
        const list2 = ref<ListItem[]>([
            { name: 'Mission', id: 5 },
            { name: 'Mission', id: 6 },
            { name: 'Mission', id: 7 }
        ])
        const list3 = ref<ListItem[]>([
            { name: 'Mission', id: 8 },
            { name: 'Mission', id: 9 },
            { name: 'Mission', id: 10 }
        ])

        return {
            group,
            list1,
            list2,
            list3
        }
    },
})
</script>

<style lang="scss">
.board {
    width: 1000px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
}
.kanban {
    &.todo {
        .board-column-header {
            background: #4a9ff9;
        }
    }
    &.working {
        .board-column-header {
            background: #f9944a;
        }
    }
    &.done {
        .board-column-header {
            background: #2ac06d;
        }
    }
}
</style>


