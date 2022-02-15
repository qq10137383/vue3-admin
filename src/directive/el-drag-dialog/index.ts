/**
 * vue3 不支持在 Fragement(多根组件)、 teleport等组件上使用自定义指令，
 * 由于el-dialog被teleport组件包裹，因此el-drag-dialog指令无效，控制台
 * 会报警告：runtime directive used on component with non element root node
 * see https://v3-migration.vuejs.org/breaking-changes/custom-directives.html#edge-case-accessing-the-component-instance
 * see https://github.com/element-plus/element-plus/issues/3281
 * 作为代替请使用el-dialog新增的draggable属性，
 * 例如：<el-dialog title="Shipping address" draggable></el-dialog>
 */

import { App } from 'vue'
import drag from './drag'

function install(app: App<Element>): void {
    app.directive('el-drag-dialog', drag)
}

if (window.Vue) {
    (window as any)['el-drag-dialog'] = drag
    window.Vue.use(install); 
}

drag.install = install
export default drag