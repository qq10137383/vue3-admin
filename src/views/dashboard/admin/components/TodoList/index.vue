
<template>
    <section class="todoapp">
        <!-- header -->
        <header class="header">
            <input
                class="new-todo"
                autocomplete="off"
                placeholder="Todo List"
                @keyup.enter="addTodo"
            />
        </header>
        <!-- main section -->
        <section v-show="hasTodo" class="main">
            <input
                id="toggle-all"
                :checked="allChecked"
                class="toggle-all"
                type="checkbox"
                @change="toggleAllTodos(allChecked)"
            />
            <label for="toggle-all"></label>
            <ul class="todo-list">
                <todo
                    v-for="(todo, index) in filteredTodos"
                    :key="index"
                    :todo="todo"
                    @toggleTodo="toggleTodo"
                    @editTodo="editTodoItem"
                    @deleteTodo="deleteTodoItem"
                />
            </ul>
        </section>
        <!-- footer -->
        <footer v-show="hasTodo" class="footer">
            <span class="todo-count">
                <strong>{{ remaining }}</strong>
                {{ pluralize(remaining, 'item') }} left
            </span>
            <ul class="filters">
                <li v-for="name in filterNames" :key="name">
                    <a
                        :class="{ selected: filterType === name }"
                        @click.prevent="setFilter(name)"
                    >{{ capitalize(name) }}</a>
                </li>
            </ul>
        </footer>
    </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import useTodo from "./use-todo"
import useFilter from "./use-filter"
import useStorage from './use-storage'
import Todo from "./Todo.vue"

export default defineComponent({
    components: {
        Todo
    },
    setup() {
        const todoState = useTodo()
        const { todos, addTodoItem, ...todoOps } = todoState

        const filterState = useFilter(todos)
        useStorage(todos)

        const hasTodo = computed(() => todos.value.length > 0)
        const allChecked = computed(() => todos.value.every(todo => todo.done))
        const remaining = computed(() => todos.value.filter(todo => !todo.done).length)

        function pluralize(n: number, w: string) {
            n === 1 ? w : w + 's'
        }
        function capitalize(s: string) {
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        function addTodo(e: KeyboardEvent) {
            const target = e.target as HTMLInputElement
            addTodoItem(target.value);
            target.value = ''
        }

        return {
            ...todoOps,
            ...filterState,
            hasTodo,
            allChecked,
            remaining,
            pluralize,
            capitalize,
            addTodo
        }
    },
})
</script>

<style lang="scss">
@use "./index.scss";
</style>
