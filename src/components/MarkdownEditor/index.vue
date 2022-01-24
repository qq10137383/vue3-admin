<template>
    <div :id="id"></div>
</template>

<script lang="ts">
// deps for editor
import '@toast-ui/editor/dist/toastui-editor.css'; // editor ui

import { defineComponent, PropType, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Editor, { EditorType } from '@toast-ui/editor'
import defaultOptions, { MdEditorOptions } from './default-options'

const MODEL_EVENT = 'update:modelValue'

export default defineComponent({
    name: 'MarkdownEditor',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            required: false,
            default: () => {
                return 'markdown-editor-' + new Date().getTime() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        options: {
            type: Object as PropType<MdEditorOptions>,
            default: () => {
                return defaultOptions
            }
        },
        mode: {
            type: String as PropType<EditorType>,
            default: 'markdown'
        },
        height: {
            type: String,
            required: false,
            default: '300px'
        },
        language: {
            type: String,
            required: false,
            default: 'en_US' // https://github.com/nhn/tui.editor/tree/master/apps/editor/src/i18n
        }
    },
    emits: [MODEL_EVENT],
    setup(props, { emit }) {
        let editor: Editor | null = null;

        const editorOptions = computed(() => {
            const options = Object.assign({}, defaultOptions, props.options)
            options.initialEditType = props.mode
            options.height = props.height
            options.language = props.language
            return options
        })

        function initEditor() {
            editor = new Editor({
                el: document.getElementById(props.id)!,
                ...editorOptions.value
            })
            if (props.modelValue) {
                editor.setMarkdown(props.modelValue)
            }
            editor.on('change', () => {
                emit(MODEL_EVENT, editor!.getMarkdown())
            })
        }
        function destroyEditor() {
            if (!editor) return
            editor.off('change')
            editor.destroy()
            editor = null
        }
        function getEditor() {
            return editor
        }
        function setValue(value: string) {
            editor?.setMarkdown(value)
        }
        function getValue() {
            return editor?.getMarkdown()
        }
        function setHtml(value: string) {
            editor?.setHTML(value)
        }
        function getHtml() {
            return editor?.getHTML()
        }

        watch(() => props.modelValue, (val, oldVal) => {
            if (editor && val !== oldVal && val !== editor.getMarkdown()) {
                editor.setMarkdown(val)
            }
        })
        watch(() => props.language, () => {
            destroyEditor()
            initEditor()
        })
        watch(() => props.height, (val) => {
            editor?.setHeight(val)
        })
        watch(() => props.mode, (val) => {
            editor?.changeMode(val)
        })

        onMounted(initEditor)
        onBeforeUnmount(destroyEditor)

        return {
            getEditor,
            setValue,
            getValue,
            setHtml,
            getHtml
        }
    },
})
</script>
