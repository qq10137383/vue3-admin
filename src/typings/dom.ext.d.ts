import { App } from 'vue'

/**
 * 全局扩展声明
 */
declare global {
    /**
     * 扩展Window对象增加关键帧动画函数、Vue实例
     */
    interface Window {
        webkitRequestAnimationFrame(callback: FrameRequestCallback): number
        mozRequestAnimationFrame(callback: FrameRequestCallback): number
        Vue?: App
        tinymce?: any
    }

    /**
     * firefox getComputedStyle
     */
    interface Document {
        currentStyle?: CSSStyleDeclaration
    }

    /**
     * firefox getComputedStyle
     */
    interface Element {
        currentStyle?: CSSStyleDeclaration
    }

    /**
     * Firefox Screen对象扩展
     */
    interface Screen {
        left: number,
        top: number
    }

    /**
     * 扩展Math对象增加缓动函数
     */
    interface Math {
        easeInOutQuad(t: number, b: number, c: number, d: number): number
    }

    /**
     * 扩展Node
     */
    interface Node {
        scrollTop: number,
        scrollLeft: number
    }

    /**
     * 扩展HTMLScriptElement
     */
    interface HTMLScriptElement {
        onreadystatechange: (() => void) | null
        readyState: string
    }

    /**
     * 扩展WheelEvent
     */
    interface WheelEvent {
        wheelDelta?: number
    }
}

export { }