import { App } from 'vue'
import { Apple, ArrowLeft, QuestionFilled, Upload, Document } from '@element-plus/icons-vue'

/**
 * 注册全局el-icon组件，注册名前缀为el-icon
 * @param app 
 */
function install(app: App<Element>): void {
    app.component('el-icon-apple', Apple)
    app.component('el-icon-arrow-left', ArrowLeft)
    app.component('el-icon-question', QuestionFilled)
    app.component('el-icon-upload', Upload)
    app.component('el-icon-document', Document)
}

export default install