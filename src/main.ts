import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from "js-cookie"

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from "element-plus"
import 'element-plus/dist/index.css'

import '@/styles/index.scss' // global css

const app = createApp(App)

app.use(store)
    .use(router)
    .use(ElementPlus, {
        size: Cookies.get('size') ?? 'small'
    })
    .mount('#app')
