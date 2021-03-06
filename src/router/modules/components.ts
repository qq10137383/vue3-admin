import { RouteRecordRaw } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

const componentsRouter: RouteRecordRaw = {
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
        {
            path: 'split-pane',
            component: () => import('@/views/components-demo/split-pane.vue'),
            name: 'SplitpaneDemo',
            meta: { title: 'SplitPane' }
        },
        {
            path: 'avatar-upload',
            component: () => import('@/views/components-demo/avatar-upload.vue'),
            name: 'AvatarUploadDemo',
            meta: { title: 'Upload' }
        },
        {
            path: 'dropzone',
            component: () => import('@/views/components-demo/dropzone.vue'),
            name: 'DropzoneDemo',
            meta: { title: 'Dropzone' }
        },
        {
            path: 'sticky',
            component: () => import('@/views/components-demo/sticky.vue'),
            name: 'StickyDemo',
            meta: { title: 'Sticky' }
        },
        {
            path: 'count-to',
            component: () => import('@/views/components-demo/count-to.vue'),
            name: 'CountToDemo',
            meta: { title: 'Count To' }
        },
        {
            path: 'mixin',
            component: () => import('@/views/components-demo/mixin.vue'),
            name: 'ComponentMixinDemo',
            meta: { title: 'Component Mixin' }
        },
        {
            path: 'back-to-top',
            component: () => import('@/views/components-demo/back-to-top.vue'),
            name: 'BackToTopDemo',
            meta: { title: 'Back To Top' }
        },
        {
            path: 'drag-dialog',
            component: () => import('@/views/components-demo/drag-dialog.vue'),
            name: 'DragDialogDemo',
            meta: { title: 'Drag Dialog' }
        },
        {
            path: 'drag-select',
            component: () => import('@/views/components-demo/drag-select.vue'),
            name: 'DragSelectDemo',
            meta: { title: 'Drag Select' }
        },
        {
            path: 'dnd-list',
            component: () => import('@/views/components-demo/dnd-list.vue'),
            name: 'DndListDemo',
            meta: { title: 'Dnd List' }
        },
        {
            path: 'drag-kanban',
            component: () => import('@/views/components-demo/drag-kanban.vue'),
            name: 'DragKanbanDemo',
            meta: { title: 'Drag Kanban' }
        }
    ]
}

export default componentsRouter