import { CustomFilters } from "./filters"

/**
 * ts识别vue文件中的导出
 */
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 声明全局过滤器的定义
 * 这样在options api中使用this.xxx时就能获得提示信息
 */
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties extends CustomFilters {

  }
}
