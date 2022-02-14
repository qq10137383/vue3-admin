import { App } from 'vue'
import waves from './waves'

function install(app: App<Element>): void {
    app.directive('waves', waves)
}

if (window.Vue) {
    (window as any)['waves'] = waves
    window.Vue.use(install); 
}

waves.install = install
export default waves