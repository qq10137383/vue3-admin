// import parseTime, formatTime and set to filter
import { parseTime, formatTime } from '@/utils'

/**
 * 全局过滤器附加到app.config.globalProperties时
 * 可以在typings/vue-runtime-ext.d.ts -> ComponentCustomProperties声明过滤器的定义
 * 这样在options api中使用this.$filters.xxx时就能获得提示信息，模板中使用不会报ts警告
 */
export interface CustomFilters {
    parseTime(time: Date | string | number, cFormat: string): string | null
    formatTime(time: number, option?: string): string | null
    pluralize(time: number, label: string): string
    timeAgo(time: number): string
    numberFormatter(num: number, digits: number): string
    toThousandFilter(num: number): string
    uppercaseFirst(str: string): string
}

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time: number, label: string): string {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

/**
 * @param {number} time
 */
function timeAgo(time: number): string {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
function numberFormatter(num: number, digits: number): string {
    const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
        }
    }
    return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
function toThousandFilter(num: number): string {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
function uppercaseFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const filters: CustomFilters = {
    parseTime,
    formatTime,
    pluralize,
    timeAgo,
    numberFormatter,
    toThousandFilter,
    uppercaseFirst
}

export default filters