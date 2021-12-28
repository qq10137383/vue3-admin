import { App, nextTick, AppConfig } from 'vue'
import store from '@/store'
import { isString, isArray } from '@/utils/validate'
import settings from '@/settings'

type ErrorParams = Parameters<NonNullable<AppConfig["errorHandler"]>>

export interface LogItem {
    err: ErrorParams[0]
    vm: ErrorParams[1]
    info: ErrorParams[2]
    url: string
}

/**
 * 是否需要启用日志记录
 * @returns 
 */
function checkNeed() {
    const { errorLog: needErrorLog } = settings

    const env: string = process.env.NODE_ENV
    if (isString(needErrorLog)) {
        return env === needErrorLog
    }
    if (isArray(needErrorLog)) {
        return needErrorLog.includes(env)
    }
    return false
}

/**
 * 捕获全局错误日志记录到vuex中
 * @param app 
 */
function install(app: App<Element>): void {
    if (checkNeed()) {
        app.config.errorHandler = function (err, vm, info) {

            // Don't ask me why I use Vue.nextTick, it just a hack.
            // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
            nextTick(() => {
                store.dispatch('errorLog/addErrorLog', {
                    err,
                    vm,
                    info,
                    url: window.location.href
                } as LogItem)
                console.error(err, info)
            })
        }
    }
}

export default install