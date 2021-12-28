import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import errorLog from '@/utils/error-log' // error-log
import svgIcons from '@/icons' // svg icons

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from "element-plus"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

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
    .use(svgIcons)
    .use(ElementPlus, {
        size: Cookies.get('size') ?? 'small',
        locale: zhCn
    })
    .mount('#app')
