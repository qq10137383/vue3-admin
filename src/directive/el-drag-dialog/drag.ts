import { ObjectDirective, Plugin } from 'vue'

interface ComputedStyleFn {
    <T extends keyof CSSStyleDeclaration>(dom: Element, attr: T): CSSStyleDeclaration[T]
}

// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
const getStyle = (function () {
    let fn: ComputedStyleFn
    if (window.document.currentStyle) {
        fn = (dom, attr) => dom.currentStyle![attr]
    } else {
        fn = (dom, attr) => window.getComputedStyle(dom)[attr]
    }
    return fn
})()

const drag: ObjectDirective<HTMLElement> & Partial<Plugin> = {
    beforeMount(el, _, vnode) {
        const dialogHeaderEl = el.querySelector<HTMLElement>('.el-dialog__header')!
        const dragDom = el.querySelector<HTMLElement>('.el-dialog')!
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - dialogHeaderEl.offsetLeft
            const disY = e.clientY - dialogHeaderEl.offsetTop

            const dragDomWidth = dragDom.offsetWidth
            const dragDomHeight = dragDom.offsetHeight

            const screenWidth = document.body.clientWidth
            const screenHeight = document.body.clientHeight

            const minDragDomLeft = dragDom.offsetLeft
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

            const minDragDomTop = dragDom.offsetTop
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

            // 获取到的值带px 正则匹配替换
            const styL = getStyle(dragDom, 'left')
            const styT = getStyle(dragDom, 'top')

            let styLn: number, styTn: number
            if (styL.includes('%')) {
                styLn = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
                styTn = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
            } else {
                styLn = +styL.replace(/\px/g, '')
                styTn = +styT.replace(/\px/g, '')
            }

            function handleMouseMove(e: MouseEvent) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX
                let top = e.clientY - disY

                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -minDragDomLeft
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }

                if (-(top) > minDragDomTop) {
                    top = -minDragDomTop
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop
                }

                // 移动当前元素
                dragDom.style.cssText += `;left:${left + styLn}px;top:${top + styTn}px;`

                // emit onDrag event
                if (vnode.component) {
                    vnode.component.emit('dragDialog', e)
                }
                else {
                    el.dispatchEvent(new CustomEvent("dragDialog", { detail: e }))
                }

            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
    }
}

// 已过时，见'./index.ts'
export default drag