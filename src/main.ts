import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import errorLog from '@/utils/error-log' // error-log
import svgIcons from '@/icons' // svg icons

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'

import '@/styles/index.scss' // global css

import './permission' // permission control

const app = createApp(App)

app.use(errorLog)
    .use(store)
    .use(router)
    .use(svgIcons)
    .use(ElementPlus, {
        size: Cookies.get('size') ?? 'small'
    })
    .mount('#app')

