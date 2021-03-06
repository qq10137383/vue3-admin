import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import errorLog from '@/utils/error-log' // error-log
import elIcons from '@/utils/el-icons' // global el-icon
import svgIcons from '@/icons' // svg icons

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import elementPlus from "element-plus"
import '@/styles/element-variables.scss'

import '@/styles/index.scss' // global css

import './permission' // permission control

import filters from './filters' // global filters

const app = createApp(App)

// register global utility filters
app.config.globalProperties.$filters = filters

app.use(errorLog)
    .use(store)
    .use(router)
    .use(elIcons)
    .use(svgIcons)
    .use(elementPlus)
    .mount('#app')
