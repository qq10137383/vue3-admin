<template>
    <div class="components-container">
        <aside>
            Markdown is based on
            <a
                href="https://github.com/nhn/tui.editor"
                target="_blank"
            >tui.editor</a> ，simply wrapped with Vue.
            <a
                target="_blank"
                href="https://panjiachen.github.io/vue-element-admin-site/feature/component/markdown-editor.html"
            >Documentation</a>
        </aside>

        <div class="editor-container">
            <el-tag class="tag-title">Basic:</el-tag>
            <markdown-editor v-model="content1" height="300px" />
        </div>

        <div class="editor-container">
            <el-tag class="tag-title">Markdown Mode:</el-tag>
            <markdown-editor
                ref="markdownEditorRef"
                v-model="content2"
                :options="{ hideModeSwitch: true, previewStyle: 'tab' }"
                height="200px"
            />
        </div>

        <div class="editor-container">
            <el-tag class="tag-title">Customize Toolbar:</el-tag>
            <markdown-editor
                v-model="content3"
                :options="{ toolbarItems: [['heading', 'bold', 'italic']] }"
            />
        </div>

        <div class="editor-container">
            <el-tag class="tag-title">I18n:</el-tag>
            <el-alert
                :closable="false"
                title="You can change the language of the admin system to see the effect"
                type="success"
            />
            <markdown-editor
                ref="markdownEditor"
                v-model="content4"
                :language="language"
                height="300px"
            />
        </div>

        <el-button
            style="margin-top:80px;"
            type="primary"
            icon="el-icon-document"
            @click="getHtml"
        >Get HTML</el-button>
        <div v-html="html" />
    </div>
</template>

<script lang="ts">
import '@toast-ui/editor/dist/i18n/zh-cn.js'

import { defineComponent, ref } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'

const content = `
**This is test**

* vue
* element
* webpack

`
const languageTypeList: Record<string, string> = {
    'en': 'en_US',
    'zh': 'zh-CN',
    'es': 'es_ES'
}

export default defineComponent({
    components: { MarkdownEditor },
    setup() {

        const content1 = ref(content)
        const content2 = ref(content)
        const content3 = ref(content)
        const content4 = ref(content)
        const language = ref(languageTypeList['zh'])
        const html = ref<string | null>('')

        const markdownEditorRef = ref<InstanceType<typeof MarkdownEditor>>()

        function getHtml() {
            html.value = markdownEditorRef.value!.getHtml()
            console.log(html.value)
        }

        return {
            content1,
            content2,
            content3,
            content4,
            language,
            html,
            markdownEditorRef,
            getHtml
        }
    },
})
</script>


<style scoped>
.editor-container {
    margin-bottom: 30px;
}
.tag-title {
    margin-bottom: 5px;
}
</style>
