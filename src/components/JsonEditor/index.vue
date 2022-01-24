<template>
    <div class="json-editor">
        <textarea ref="textareaRef" />
    </div>
</template>

<script lang="ts">
import 'codemirror/lib/codemirror.css'  // codemirror core css
import 'codemirror/theme/rubyblue.css'  // codemirror theme
import 'codemirror/addon/lint/lint.css' // codemirror lint

import CodeMirror, { EditorFromTextArea } from 'codemirror'  // codemirror core js
import 'codemirror/mode/javascript/javascript' // codemirror js、json mode
import 'codemirror/addon/lint/lint'   // base lint
import 'codemirror/addon/lint/json-lint'  // json lint

// 1、codemirror/addon/lint/json-lint需要调用jsonlint模块，而且读取的是window.jsonlint
//    由于使用es6 import是局部范围模块，不是window，所以改用script-loader
// 2、webpack的内联导入模式指定使用script-loader来加载jsonlint模块，替换默认的babel-loader
//    script-loader的作用是在全局上下文(window)对象下执行脚本 -> eval(null,script)
//    下面脚本等同于:
//       import jsonlint from 'jsonlint'
//       window.jsonlint = jsonlint
require('script-loader!jsonlint')

import { defineComponent, ref, onMounted, watch, computed } from 'vue'

const CHANGE_EVENT = 'changed'
const MODEL_EVENT = 'update:modelValue'

export default defineComponent({
    name: 'JsonEditor',
    props: {
        modelValue: {
            type: [String, Object],
            default: ""
        },
    },
    emits: [CHANGE_EVENT, MODEL_EVENT],
    setup(props, { emit }) {
        let jsonEditor: EditorFromTextArea | null = null

        const textareaRef = ref<HTMLTextAreaElement>()

        const editorText = computed(() => {
            return typeof props.modelValue == 'string'
                ? props.modelValue : JSON.stringify(props.modelValue, null, 2)
        })

        function getEditor() {
            return jsonEditor
        }
        function getValue() {
            return jsonEditor?.getValue()
        }
        function parseValue(val: string) {
            return typeof props.modelValue == 'string' ? val : JSON.parse(val)
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
            jsonEditor.on('change', cm => {
                emit(CHANGE_EVENT, parseValue(cm.getValue()))
                emit(MODEL_EVENT, parseValue(cm.getValue()))
            })
        }

        watch(editorText, (val) => {
            jsonEditor?.setValue(val)
        })

        onMounted(initJsonEditor)

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

    ::v-deep {
        .CodeMirror {
            height: auto;
            min-height: 300px;
        }

        .CodeMirror-scroll {
            min-height: 300px;
        }

        .cm-s-rubyblue span.cm-string {
            color: #f08047;
        }
    }
}
</style>
