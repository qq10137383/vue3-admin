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

const DELETE_TODO_EVENT = "deleteTodo"
const EDIT_TODO_EVENT = "editTodo"
const TOGGLE_TODO_EVENT = "toggleTodo"

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
    emits: [DELETE_TODO_EVENT, EDIT_TODO_EVENT, TOGGLE_TODO_EVENT],
    setup(props, { emit }) {
        const editing = ref(false)

        function deleteTodo(todo: TodoItem) {
            emit(DELETE_TODO_EVENT, todo)
        }
        function editTodo({ todo, value }: { todo: TodoItem, value: string }) {
            emit(EDIT_TODO_EVENT, { todo, value })
        }
        function toggleTodo(todo: TodoItem) {
            emit(TOGGLE_TODO_EVENT, todo)
        }
        function doneEdit(e: KeyboardEvent | FocusEvent) {
            const value = (e.target as HTMLInputElement).value.trim()
            if (!value) {
                emit(DELETE_TODO_EVENT, props.todo)
            } else if (editing.value) {
                emit(EDIT_TODO_EVENT, { todo: props.todo, value })
                editing.value = false
            }
        }
        function cancelEdit(e: KeyboardEvent) {
            (e.target as HTMLInputElement).value = props.todo.text
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
