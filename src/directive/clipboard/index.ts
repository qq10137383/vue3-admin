import { App } from 'vue'
import clipboard from './clipboard'

function install(app: App<Element>): void {
    app.directive('clipboard', clipboard)
}

if (window.Vue) {
    (window as any)['clipboard'] = clipboard
    window.Vue.use(install); 
}

clipboard.install = install
export default clipboard