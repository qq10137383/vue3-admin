import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import errorLog from '@/utils/error-log' // error-log
import elIcons from '@/utils/el-icons' // global el-icon
import svgIcons from '@/icons' // svg icons

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from "element-plus"
import '@/styles/element-variables.scss'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

import '@/styles/index.scss' // global css

import './permission' // permission control

import filters from './filters' // global filters

const app = createApp(App)

// register global utility filters
Object.keys(filters).forEach(key => {
    app.config.globalProperties[key] = (filters as any)[key]
})

app.use(errorLog)
    .use(store)
    .use(router)
    .use(elIcons)
    .use(svgIcons)
    .use(ElementPlus, {
        locale: zhCn
    })
    .mount('#app')
