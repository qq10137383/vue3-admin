import { CustomFilters } from "@/filters"

/**
 * 1、声明全局过滤器的定义
 *   这样在options api中使用this.$filters.xxx时就能获得提示信息，模板中使用不会报ts警告
 */
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $filters: CustomFilters
    }
}

export { }
