// doc: https://nhn.github.io/tui.editor/latest/ToastUIEditorCore
import { EditorOptions } from '@toast-ui/editor'

export type MdEditorOptions = Omit<EditorOptions, 'el'>

const options: MdEditorOptions = {
    minHeight: '200px',
    previewStyle: 'vertical',
    useCommandShortcut: true,
    usageStatistics: false,
    hideModeSwitch: false,
    autofocus: false,
    toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync'],
    ]
}

export default options
