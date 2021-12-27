<template>
    <li :class="{ completed: todo.done, editing: editing }" class="todo">
        <div class="view">
            <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)" />
            <label @dblclick="editing = true" v-text="todo.text" />
            <button class="destroy" @click="deleteTodo(todo)" />
        </div>
        <input
            v-show="editing"
            v-focus="editing"
            :value="todo.text"
            class="edit"
            @keyup.enter="doneEdit"
            @keyup.esc="cancelEdit"
            @blur="doneEdit"
        />
    </li>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, nextTick } from 'vue'
import { TodoItem } from './use-todo'

export default defineComponent({
    directives: {
        focus(el: HTMLElement, { value }: { value: boolean }) {
            if (value) {
                nextTick(() => el.focus())
            }
        }
    },
    props: {
        todo: {
            type: Object as PropType<TodoItem>,
            // 使用PropType定义type时，default、validator务必使用箭头函数，否则无法推断类型
            // see: https://v3.cn.vuejs.org/guide/typescript-support.html#%E6%B3%A8%E8%A7%A3-props
            default: () => {
                return {} as TodoItem
            }
        }
    },
    setup(props, { emit }) {
        const editing = ref(false)

        function deleteTodo(todo: TodoItem) {
            emit('deleteTodo', todo)
        }
        function editTodo({ todo, value }: { todo: TodoItem, value: string }) {
            emit('editTodo', { todo, value })
        }
        function toggleTodo(todo: TodoItem) {
            emit('toggleTodo', todo)
        }
        function doneEdit(e: KeyboardEvent | FocusEvent) {
            const value = (e.target as any).value.trim()
            if (!value) {
                emit('deleteTodo', props.todo)
            } else if (editing.value) {
                emit('editTodo', { todo: props.todo, value })
                editing.value = false
            }
        }
        function cancelEdit(e: KeyboardEvent) {
            (e.target as any).value = props.todo.text
            editing.value = false
        }

        return {
            editing,
            deleteTodo,
            editTodo,
            toggleTodo,
            doneEdit,
            cancelEdit
        }
    },
})
</script>
