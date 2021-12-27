import { ref, Ref } from "vue"

export interface TodoItem {
    text: string,
    done: boolean
}

export type TodoList = TodoItem[]

export interface UseTodo {
    todos: Ref<TodoList>
    addTodoItem: (todo: string) => TodoItem
    editTodoItem(editItem: { todo: TodoItem, value: string }): void
    deleteTodoItem(todo: TodoItem): void
    toggleTodo(todo: TodoItem): void
    toggleAllTodos(done: boolean): void
}

const defalutList: TodoItem[] = [
    { text: 'star this repository', done: false },
    { text: 'fork this repository', done: false },
    { text: 'follow author', done: false },
    { text: 'vue-element-admin', done: true },
    { text: 'vue', done: true },
    { text: 'element-ui', done: true },
    { text: 'axios', done: true },
    { text: 'webpack', done: true }
]

export default function useToo(): UseTodo {
    const todos = ref(defalutList)

    function addTodoItem(todo: string): TodoItem {
        const item = {
            text: todo,
            done: false
        }
        todos.value.push(item)
        return item
    }
    function editTodoItem({ todo, value }: { todo: TodoItem, value: string }) {
        todo.text = value
    }
    function deleteTodoItem(todo: TodoItem) {
        todos.value.splice(todos.value.indexOf(todo), 1)
    }
    function toggleTodo(todo: TodoItem) {
        todo.done = !todo.done
    }
    function toggleAllTodos(done: boolean) {
        todos.value.forEach(todo => (todo.done = done))
    }

    return {
        todos,
        addTodoItem,
        editTodoItem,
        deleteTodoItem,
        toggleTodo,
        toggleAllTodos
    }
}