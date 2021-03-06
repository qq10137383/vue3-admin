import { ElMessage } from 'element-plus'
import Clipboard from 'clipboard'

function clipboardSuccess() {
    ElMessage({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
    })
}

function clipboardError() {
    ElMessage({
        message: 'Copy failed',
        type: 'error'
    })
}

export default function handleClipboard(text: string, event: MouseEvent): void {
    const clipboard = new Clipboard(event.currentTarget as HTMLElement, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess()
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardError()
        clipboard.destroy()
    });
    (clipboard as any).onClick(event)
}
