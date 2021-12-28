import { InstallOptions } from 'element-plus/lib/utils/config'
import { CustomFilters } from "@/filters"

/**
 * 1、声明全局过滤器的定义
 *   这样在options api中使用this.xxx时就能获得提示信息，模板中使用不会报ts警告
 * 2、定义Element-plus全局设置$ELEMENT
 */
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties extends CustomFilters {
        $ELEMENT?: Partial<InstallOptions>
    }
}

export { }