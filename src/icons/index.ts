import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component

/**
 * 注册svg-icon组件，并加载src/icons中所有icon到html中
 * @param app 
 */
function install(app: App<Element>): void {
    app.component('svg-icon', SvgIcon)

    const req = require.context('./svg', false, /\.svg$/)
    const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().map(requireContext)
    requireAll(req)
}

export default install