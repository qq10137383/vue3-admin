import { App } from 'vue'
import permission from './permission'

function install(app: App<Element>): void {
    app.directive('permission', permission)
}

if (window.Vue) {
    (window as any)['permission'] = permission
    window.Vue.use(install); 
}

permission.install = install
export default permission