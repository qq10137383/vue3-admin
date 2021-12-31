import { ref, computed, Ref, ComputedRef } from "vue";
import type { TodoList } from "./use-todo"

export type FilterType = 'all' | 'active' | 'completed'

type Filters = {
    [key in FilterType]: (todos: TodoList) => TodoList
}

export interface UseFilter {
    filterType: Ref<FilterType>
    filterNames: Ref<FilterType[]>
    filteredTodos: ComputedRef<TodoList>
    setFilter(filter: FilterType): void
}

const filters: Filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.done),
    completed: todos => todos.filter(todo => todo.done)
}

export default function useFilter(todos: Ref<TodoList>, defaultFilter: FilterType = "all"): UseFilter {
    const filterType = ref(defaultFilter)
    const filterNames = ref(Object.keys(filters)) as any

    const filteredTodos = computed(() => {
        return filters[filterType.value](todos.value)
    })

    function setFilter(filter: FilterType) {
        filterType.value = filter
    }

    return {
        filterType,
        filterNames,
        filteredTodos,
        setFilter
    }
}
