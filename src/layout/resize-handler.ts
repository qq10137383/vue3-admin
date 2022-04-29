import { watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAppStore, DeviceType } from '@/store/modules/app'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default function resizeHandler(): void {

    const route = useRoute()

    const appStore = useAppStore()
    const { device, sidebar } = storeToRefs(appStore)

    function checkIsMobile() {
        const rect = body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
    }
    function resizeHandler() {
        const isMobile = checkIsMobile()
        if (!document.hidden) {
            appStore.toggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop)

            if (isMobile) {
                appStore.closeSideBar(true)
            }
        }
    }

    watch(() => route.path, () => {
        if (device.value === 'mobile' && sidebar.value.opened) {
            appStore.closeSideBar(false)
        }
    })

    onBeforeMount(() => {
        window.addEventListener('resize', resizeHandler)
    })
    onMounted(() => {
        const isMobile = checkIsMobile()
        if (isMobile) {
            appStore.toggleDevice(DeviceType.Mobile)
            appStore.closeSideBar(false)
        }
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler)
    })
}
