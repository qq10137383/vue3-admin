
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, Ref, watch } from 'vue'
import { debounce } from '@/utils'

export type ResizeFn = () => void

export function useResize(cb: Ref<ResizeFn>): void {
    let sidebarElm: Element | null = null
    let resizeHandler: any = null

    function initResizeHandler() {
        resizeHandler = debounce(cb.value, 100)
    }
    function initResizeEvent() {
        resizeHandler && window.addEventListener('resize', resizeHandler)
    }
    function destroyResizeEvent() {
        resizeHandler && window.removeEventListener('resize', resizeHandler)
    }
    function sidebarResizeHandler(e: TransitionEvent) {
        e.propertyName === 'width' && resizeHandler()
    }
    function initSidebarResizeEvent() {
        sidebarElm = document.getElementsByClassName('sidebar-container')[0]
        sidebarElm?.addEventListener('transitionend', sidebarResizeHandler as any)
    }
    function destroySidebarResizeEvent() {
        sidebarElm?.removeEventListener('transitionend', sidebarResizeHandler as any)
    }
    function initAllResizeEvents() {
        initResizeEvent()
        initSidebarResizeEvent()
    }
    function destroyAllResizeEvents() {
        destroyResizeEvent()
        destroySidebarResizeEvent()
    }

    watch(() => cb.value, () => {
        destroyAllResizeEvents()
        initResizeHandler()
        initAllResizeEvents()
    })

    onMounted(() => {
        initResizeHandler()
        initAllResizeEvents()
    })
    onBeforeUnmount(destroyAllResizeEvents)
    onActivated(initAllResizeEvents)
    onDeactivated(destroyAllResizeEvents)
}