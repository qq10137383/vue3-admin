import { App } from 'vue'
import { Apple } from '@element-plus/icons-vue'

/**
 * 注册全局el-icon组件，注册名前缀为el-icon
 * @param app 
 */
function install(app: App<Element>): void {
    app.component('el-icon-apple', Apple)
}

export default install