import { watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useGetter } from "@/hooks/use-vuex"

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default function resizeHandler(): void {
    const store = useStore()
    const route = useRoute()

    const { device, sidebar } = useGetter(["device", "sidebar"])

    function checkIsMobile() {
        const rect = body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
    }
    function resizeHandler() {
        const isMobile = checkIsMobile()
        if (!document.hidden) {
            store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

            if (isMobile) {
                store.dispatch('app/closeSideBar', { withoutAnimation: true })
            }
        }
    }

    watch(route, () => {
        if (device.value === 'mobile' && sidebar.value.opened) {
            store.dispatch('app/closeSideBar', { withoutAnimation: false })
        }
    })

    onBeforeMount(() => {
        window.addEventListener('resize', resizeHandler)
    })
    onMounted(() => {
        const isMobile = checkIsMobile()
        if (isMobile) {
            store.dispatch('app/toggleDevice', 'mobile')
            store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeHandler)
    })
}
