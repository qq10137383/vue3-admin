import { ObjectDirective, Plugin } from 'vue'
import Clipboard from 'clipboard'

type ClipboardBinding = string | ((e: Clipboard.Event) => void)

declare global {
    interface HTMLElement {
        _v_clipboard_success?: ClipboardBinding
        _v_clipboard_error?: ClipboardBinding
        _v_clipboard?: Clipboard
    }
}

const clipboard: ObjectDirective<HTMLElement, ClipboardBinding> & Partial<Plugin> = {
    mounted(el, binding) {
        if (binding.arg === 'success') {
            el._v_clipboard_success = binding.value
        } else if (binding.arg === 'error') {
            el._v_clipboard_error = binding.value
        } else {
            const clipboard = new Clipboard(el, {
                text() { return binding.value.toString() },
                action() { return binding.arg === 'cut' ? 'cut' : 'copy' }
            })
            clipboard.on('success', e => {
                const callback = el._v_clipboard_success
                if (callback && typeof callback == 'function') {
                    callback(e)
                }
            })
            clipboard.on('error', e => {
                const callback = el._v_clipboard_error
                if (callback && typeof callback == 'function') {
                    callback(e)
                }
            })
            el._v_clipboard = clipboard
        }
    },
    updated(el, binding) {
        if (binding.arg === 'success') {
            el._v_clipboard_success = binding.value
        } else if (binding.arg === 'error') {
            el._v_clipboard_error = binding.value
        } else {
            const _v_clipboard = el._v_clipboard as any
            _v_clipboard.text = function () { return binding.value.toString() }
            _v_clipboard.action = function () { return binding.arg === 'cut' ? 'cut' : 'copy' }
        }
    },
    unmounted(el, binding) {
        if (binding.arg === 'success') {
            delete el._v_clipboard_success
        } else if (binding.arg === 'error') {
            delete el._v_clipboard_error
        } else {
            el._v_clipboard?.destroy()
            delete el._v_clipboard
        }
    }
}

export default clipboard