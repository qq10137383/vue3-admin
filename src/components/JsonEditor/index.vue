<template>
    <div class="json-editor">
        <textarea ref="textareaRef" />
    </div>
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css'  // codemirror core css
import 'codemirror/theme/rubyblue.css'  // codemirror theme
import 'codemirror/addon/lint/lint.css' // codemirror lint

import CodeMirror, { Editor, EditorFromTextArea } from 'codemirror'  // codemirror core js

// 1、codemirror/addon/lint/json-lint需要调用jsonlint模块，而且读取的是window.jsonlint
//    由于使用es6 import是局部范围模块，不是window
// 2、webpack的内联导入模式指定使用script-loader来加载jsonlint模块，替换默认的babel-loader
//    script-loader的作用是在全局上下文(window)对象下执行脚本 -> eval(null,script)
//    require('script-loader!jsonlint')作用等同于:
//       import jsonlint from 'jsonlint'
//       window.jsonlint = jsonlint
//    但是jsonlint代码包含了nodejs的模块(file、system等)，在使用模块化导入静态依赖分析会报错，
//    所以上面代码其实是行不通的
require('script-loader!jsonlint') //json lint

import 'codemirror/mode/javascript/javascript' // codemirror js、json mode
import 'codemirror/addon/lint/lint'   // base lint
import 'codemirror/addon/lint/json-lint'  // json lint addon

import { defineComponent, ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'

const CHANGE_EVENT = 'changed'
const MODEL_EVENT = 'update:modelValue'

export default defineComponent({
    name: 'JsonEditor',
    props: {
        // json对象或json字符串，如果是json对象，需要用ref而不是reactive
        modelValue: {
            type: [String, Object],
            default: ""
        },
        // modelValue为json字符串时是否需要格式化
        format: {
            type: Boolean,
            default: true
        }
    },
    emits: [CHANGE_EVENT, MODEL_EVENT],
    setup(props, { emit }) {
        let jsonEditor: EditorFromTextArea | null = null

        const textareaRef = ref<HTMLTextAreaElement>()

        function formatStringify(val: Record<any, any>) {
            return JSON.stringify(val, null, 2)
        }

        const editorText = computed(() => {
            let formatText: string
            if (typeof props.modelValue == 'string') {
                formatText = props.modelValue
                if (props.format) {
                    try {
                        formatText = formatStringify(JSON.parse(formatText))
                    }
                    catch {
                        formatText = props.modelValue
                    }
                }
            }
            else {
                formatText = formatStringify(props.modelValue)
            }
            return formatText
        })

        function parseValue(val: string) {
            return typeof props.modelValue == 'string' ? val : JSON.parse(val)
        }
        function handleTextChange(editor: Editor) {
            emit(CHANGE_EVENT, parseValue(editor.getValue()))
            emit(MODEL_EVENT, parseValue(editor.getValue()))
        }
        function initJsonEditor() {
            jsonEditor = CodeMirror.fromTextArea(textareaRef.value!, {
                lineNumbers: true,
                mode: 'application/json',
                gutters: ['CodeMirror-lint-markers'],
                theme: 'rubyblue',
                lint: true
            })
            jsonEditor.setValue(editorText.value)
            jsonEditor.on('change', handleTextChange)
        }
        function destroyJsonEditor() {
            jsonEditor?.off('change', handleTextChange)
            jsonEditor = null
        }
        function getEditor() {
            return jsonEditor
        }
        function getValue() {
            return jsonEditor?.getValue()
        }

        watch(editorText, (val) => {
            jsonEditor?.setValue(val)
        })

        onMounted(initJsonEditor)
        onBeforeUnmount(destroyJsonEditor)

        return {
            textareaRef,
            getEditor,
            getValue
        }
    },
})
</script>


<style lang="scss" scoped>
.json-editor {
    height: 100%;
    position: relative;

    ::v-deep(.CodeMirror) {
        height: auto;
        min-height: 300px;
    }

    ::v-deep(.CodeMirror-scroll) {
        min-height: 300px;
    }

    ::v-deep(.cm-s-rubyblue span.cm-string) {
        color: #f08047;
    }
}
</style>
