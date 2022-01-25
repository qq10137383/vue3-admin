import { CustomRouteRecordRaw } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

const componentsRouter: CustomRouteRecordRaw = {
    path: '/components',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ComponentDemo',
    meta: {
        title: 'Components',
        icon: 'component'
    },
    children: [
        {
            path: 'tinymce',
            component: () => import('@/views/components-demo/tinymce.vue'),
            name: 'TinymceDemo',
            meta: { title: 'Tinymce' }
        },
        {
            path: 'markdown',
            component: () => import('@/views/components-demo/markdown.vue'),
            name: 'MarkdownDemo',
            meta: { title: 'Markdown' }
        },
        {
            path: 'json-editor',
            component: () => import('@/views/components-demo/json-editor.vue'),
            name: 'JsonEditorDemo',
            meta: { title: 'JSON Editor' }
        },
    ]
}

export default componentsRouter