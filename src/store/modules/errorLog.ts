import { ref } from 'vue'
import { defineStore } from "pinia"
import { LogItem } from "@/utils/error-log"

/**
 * 错误日志模块
 */
export const useErrorLogStore = defineStore('errorLog', () => {
    // state
    const logs = ref<LogItem[]>([])

    // actions 
    function addErrorLog(log: LogItem) {
        logs.value.push(log)
    }
    function clearErrorLog() {
        logs.value.splice(0)
    }

    return {
        logs,
        addErrorLog,
        clearErrorLog
    }
})