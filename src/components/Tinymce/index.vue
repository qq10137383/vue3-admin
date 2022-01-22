<template>
    <div
        :class="{ fullscreen: fullscreen }"
        class="tinymce-container"
        :style="{ width: containerWidth }"
    >
        <textarea :id="id" class="tinymce-textarea" />
        <div class="editor-custom-btn-container">
            <editor-image color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
        </div>
    </div>
</template>

<script lang="ts">
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import {
    defineComponent, PropType, ref, computed, watch, nextTick,
    onActivated, onDeactivated, onMounted, onBeforeUnmount
} from 'vue'
import { ElMessage } from 'element-plus'
import EditorImage, { CustomUploadFile } from './components/EditorImage.vue'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

const languageTypeList: Record<string, string> = {
    'en': 'en',
    'zh': 'zh_CN',
    'es': 'es_MX',
    'ja': 'ja'
}

const MODEL_EVENT = 'update:modelValue'

export default defineComponent({
    name: 'Tinymce',
    components: {
        EditorImage
    },
    props: {
        id: {
            type: String,
            default: () => {
                return 'vue-tinymce-' + new Date().getTime() + ((Math.random() * 1000).toFixed(0) + '')
            }
        },
        modelValue: {
            type: String,
            default: ''
        },
        toolbar: {
            type: Array as PropType<string[]>,
            required: false,
            default: () => []
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        },
    },
    emits: [MODEL_EVENT],
    setup(props, { emit }) {
        let hasChange = false
        let hasInit = false

        const fullscreen = ref(false)

        const containerWidth = computed(() => {
            const width = props.width
            if (/^[\d]+(\.[\d]+)?$/.test(String(width))) { // matches `100`, `'100'`
                return `${width}px`
            }
            return width
        })

        function initTinymce() {
            window.tinymce.init({
                selector: `#${props.id}`,
                language: languageTypeList['en'],
                height: props.height,
                body_class: 'panel-body ',
                object_resizing: false,
                toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
                menubar: props.menubar,
                plugins: plugins,
                end_container_on_empty_block: true,
                powerpaste_word_import: 'clean',
                code_dialog_height: 450,
                code_dialog_width: 1000,
                advlist_bullet_styles: 'square',
                advlist_number_styles: 'default',
                imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                init_instance_callback: (editor: any) => {
                    if (props.modelValue) {
                        editor.setContent(props.modelValue)
                    }
                    hasInit = true
                    editor.on('NodeChange Change KeyUp SetContent', () => {
                        hasChange = true
                        emit(MODEL_EVENT, editor.getContent())
                    })
                },
                setup(editor: any) {
                    editor.on('FullscreenStateChanged', (e: any) => {
                        fullscreen.value = e.state
                    })
                },
                convert_urls: false
            })
        }
        function init() {
            // dynamic load tinymce from cdn
            load(tinymceCDN, (err) => {
                if (err) {
                    ElMessage.error(err.message)
                    return
                }
                initTinymce()
            })
        }
        function destroyTinymce() {
            const tinymce = window.tinymce.get(props.id)
            if (fullscreen.value) {
                tinymce.execCommand('mceFullScreen')
            }
            if (tinymce) {
                tinymce.destroy()
            }
        }
        function getTinymce() {
            return window.tinymce.get(props.id)
        }
        function setContent(value: string) {
            window.tinymce.get(props.id).setContent(value)
        }
        function getContent(): string {
            return window.tinymce.get(props.id).getContent()
        }
        function imageSuccessCBK(arr: CustomUploadFile[]) {
            arr.forEach(v => window.tinymce.get(props.id).insertContent(`<img class="wscnph" src="${v.url}" >`))
        }

        watch(() => props.modelValue, (val) => {
            if (!hasChange && hasInit) {
                nextTick(() => setContent(val || ''))
            }
        })

        onMounted(init)
        onActivated(() => window.tinymce && initTinymce())
        onDeactivated(destroyTinymce)
        onBeforeUnmount(destroyTinymce)

        return {
            fullscreen,
            containerWidth,
            getTinymce,
            setContent,
            getContent,
            imageSuccessCBK
        }
    }
})
</script>


<style lang="scss" scoped>
.tinymce-container {
    position: relative;
    line-height: normal;
}

.tinymce-container {
    ::v-deep(.mce-fullscreen) {
        z-index: 10000;
    }
}

.tinymce-textarea {
    visibility: hidden;
    z-index: -1;
}

.editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
}

.editor-upload-btn {
    display: inline-block;
}
</style>
