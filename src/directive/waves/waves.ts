import { ObjectDirective, DirectiveBinding, Plugin } from 'vue'
import './waves.css'

const context = '@@wavesContext'

function handleClick(el: HTMLElement, binding: DirectiveBinding<any>) {
    function handle(e: MouseEvent) {
        const customOpts = Object.assign({}, binding.value)
        const opts = Object.assign({
            ele: el, // 波纹作用元素
            type: 'hit', // hit 点击位置扩散 center中心点扩展
            color: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
        }, customOpts)
        const target = opts.ele as HTMLElement
        if (target) {
            target.style.position = 'relative'
            target.style.overflow = 'hidden'
            const rect = target.getBoundingClientRect()
            let ripple = target.querySelector<HTMLSpanElement>('.waves-ripple')
            if (!ripple) {
                ripple = document.createElement('span')
                ripple.className = 'waves-ripple'
                ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px'
                target.appendChild(ripple)
            } else {
                ripple.className = 'waves-ripple'
            }
            switch (opts.type) {
                case 'center':
                    ripple.style.top = rect.height / 2 - ripple.offsetHeight / 2 + 'px'
                    ripple.style.left = rect.width / 2 - ripple.offsetWidth / 2 + 'px'
                    break
                default:
                    ripple.style.top =
                        (e.pageY - rect.top - ripple.offsetHeight / 2 - document.documentElement.scrollTop ||
                            document.body.scrollTop) + 'px'
                    ripple.style.left =
                        (e.pageX - rect.left - ripple.offsetWidth / 2 - document.documentElement.scrollLeft ||
                            document.body.scrollLeft) + 'px'
            }
            ripple.style.backgroundColor = opts.color
            ripple.className = 'waves-ripple z-active'
            return false
        }
    }

    const elAny = el as any
    if (!elAny[context]) {
        elAny[context] = {
            removeHandle: handle
        }
    } else {
        elAny[context].removeHandle = handle
    }

    return handle
}

const waves: ObjectDirective<HTMLElement> & Partial<Plugin> = {
    beforeMount(el, binding) {
        el.addEventListener('click', handleClick(el, binding), false)
    },
    updated(el: any, binding) {
        el.removeEventListener('click', el[context].removeHandle, false)
        el.addEventListener('click', handleClick(el, binding), false)
    },
    unmounted(el: any) {
        el.removeEventListener('click', el[context].removeHandle, false)
        el[context] = null
        delete el[context]
    }
}

export default waves