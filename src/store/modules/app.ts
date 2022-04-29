import { ref, reactive } from 'vue'
import { defineStore } from "pinia"
import Cookies from 'js-cookie'

/**
 * 设备类型
 */
export enum DeviceType {
    Desktop = "desktop",
    Mobile = "mobile"
}

/**
 * Element 组件尺寸
 */
export type Size = "default" | "small" | "large"

/**
 * app store模块
 */
export const useAppStore = defineStore('app', () => {
    // state
    const sidebar = reactive({
        opened: Cookies.get('sidebarStatus') ? !!Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    })
    const device = ref(DeviceType.Desktop)
    const size = ref<Size>(Cookies.get('size') as Size || 'default')

    // actions
    function toggleSideBar() {
        sidebar.opened = !sidebar.opened
        sidebar.withoutAnimation = false
        if (sidebar.opened) {
            Cookies.set('sidebarStatus', "1")
        } else {
            Cookies.set('sidebarStatus', "0")
        }
    }
    function closeSideBar(withoutAnimation: boolean) {
        Cookies.set('sidebarStatus', "0")
        sidebar.opened = false
        sidebar.withoutAnimation = withoutAnimation
    }
    function toggleDevice(deviceValue: DeviceType) {
        device.value = deviceValue
    }
    function setSize(sizeValue: Size) {
        size.value = sizeValue
        Cookies.set('size', size.value)
    }

    return {
        sidebar,
        device,
        size,
        toggleSideBar,
        closeSideBar,
        toggleDevice,
        setSize
    }
})