
import { watchEffect, Ref } from "vue"
import type { TodoList } from "./use-todo"

const STORAGE_KEY = 'todos'

export default function useStorage(todos: Ref<TodoList>): void {
    watchEffect(() => {
        // JSON.stringify会深度遍历对象，相当于是深度监听
        // 所以只要todos的任意层次属性发生变化就会触发effect
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
    })
}