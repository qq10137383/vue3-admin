<template>
    <teleport to="body">
        <transition name="vicp">
            <div class="vue-image-crop-upload" v-show="modelValue">
                <div class="vicp-wrap">
                    <div class="vicp-close" @click="close">
                        <i class="vicp-icon4"></i>
                    </div>
                    <component :is="componentName" v-bind="$props" />
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import {
    defineComponent, PropType, ExtractPropTypes, reactive, computed,
    provide, watch, getCurrentInstance, onBeforeUnmount
} from 'vue'
import language from './utils/language'
import mimes, { MimeType } from './utils/mimes'
import { CropperState, wizardKey, stateKey, sharedKey } from './utils/tokens'
import { MODEL_EVENT } from '@/utils/constants'
import { useStep } from '@/hooks/use-step'

import Reset from './steps/reset.vue'
import DropArea from './steps/drop-area.vue'
import Crop from './steps/crop.vue'
import Upload from './steps/upload.vue'

const SRC_FILE_SET_EVENT = 'src-file-set'
const CROP_SUCCESS_EVENT = 'crop-success'
const CROP_UPLOAD_SUCCESS_EVENT = 'crop-upload-success'
const CROP_UPLOAD_FAIL_EVENT = 'crop-upload-fail'

const cropperProps = {
    // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    field: {
        type: String,
        default: 'avatar'
    },
    // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    ki: {
        type: String,
        default: '0'
    },
    // 显示该控件与否
    modelValue: {
        type: Boolean,
        default: true
    },
    // 上传地址
    url: {
        type: String,
        default: ''
    },
    // 其他要上传文件附带的数据，对象格式
    params: {
        type: Object,
        default: () => null
    },
    //Add custom headers
    headers: {
        type: Object,
        default: () => null
    },
    // 剪裁图片的宽
    width: {
        type: Number,
        default: 200
    },
    // 剪裁图片的高
    height: {
        type: Number,
        default: 200
    },
    // 不显示旋转功能
    noRotate: {
        type: Boolean,
        default: true
    },
    // 不预览圆形图片
    noCircle: {
        type: Boolean,
        default: false
    },
    // 不预览方形图片
    noSquare: {
        type: Boolean,
        default: false
    },
    // 单文件大小限制
    maxSize: {
        type: Number,
        default: 1024 * 10
    },
    // 语言类型
    langType: {
        type: String,
        default: 'en'
    },
    // 语言包
    langExt: {
        type: Object,
        default: null
    },
    // 图片上传格式
    imgFormat: {
        type: String as PropType<MimeType>,
        default: 'png'
    },
    // 图片背景 jpg情况下生效
    imgBgc: {
        type: String,
        default: '#fff'
    },
    // 是否支持跨域
    withCredentials: {
        type: Boolean,
        default: false
    },
    method: {
        type: String,
        default: 'POST'
    },
    initialImgUrl: {
        type: String,
        default: ''
    },
    // 允许上传的图片格式
    allowImgFormat: {
        type: Array as PropType<MimeType[]>,
        validator: (val: string[]) => {
            const mineTypes = Object.keys(mimes)
            return val.every(m => mineTypes.includes(m))
        },
        default: () => ['gif', 'jpg', 'png']
    }
}

export type CropperProps = ExtractPropTypes<typeof cropperProps>

export default defineComponent({
    components: {
        Reset,
        DropArea,
        Crop,
        Upload
    },
    props: cropperProps,
    emits: [
        MODEL_EVENT, SRC_FILE_SET_EVENT, CROP_SUCCESS_EVENT,
        CROP_UPLOAD_SUCCESS_EVENT, CROP_UPLOAD_FAIL_EVENT
    ],
    setup(props, { emit }) {
        const step = useStep()

        const componentName = computed(() => {
            const steps = (getCurrentInstance()!.type as any).components
            return Object.keys(steps).find(
                (m) => steps[m].__stepIndex === step.current.value
            );
        })
        const lang = computed(() => {
            const langDef = language[props.langType] ?? language['en']
            props.langExt && Object.assign(langDef, props.langExt);
            return langDef
        })
        const mime = computed(() => {
            const tempImgFormat = props.allowImgFormat.indexOf(props.imgFormat) === -1 ? 'jpg' : props.imgFormat
            return mimes[tempImgFormat];
        })

        function createState() {
            const state: CropperState = {
                currentState: -1,
                sourceImgUrl: props.initialImgUrl,
                file: undefined,
                createImgUrl: props.initialImgUrl,
                uploadResult: undefined
            }
            return state
        }

        const cropperState = reactive(createState())

        // 窗口打开时，设置了图片就直接跳到裁剪步骤，否则跳到选择图片步骤
        function on() {
            const stepIndex = cropperState.sourceImgUrl ? 3 : 2
            step.goto(stepIndex)
        }
        // 窗口关闭时，重置组件状态
        function off() {
            Object.assign(cropperState, createState())
            step.reset()
        }
        function close() {
            emit(MODEL_EVENT, false)
        }
        function handleEscClose(e: KeyboardEvent) {
            if (props.modelValue && e.key == 'Escape') {
                close();
            }
        }
        function init() {
            // 绑定按键esc隐藏此插件事件
            document.addEventListener('keyup', handleEscClose)
        }

        watch(() => cropperState.currentState, (val) => {
            switch (val) {
                // 选择图片完成
                case 0:
                    emit(SRC_FILE_SET_EVENT, cropperState.file, cropperState.sourceImgUrl)
                    break
                // 裁剪图片完成
                case 1:
                    emit(CROP_SUCCESS_EVENT, cropperState.createImgUrl, props.field, props.ki)
                    break
                // 上传成功
                case 3:
                    emit(CROP_UPLOAD_SUCCESS_EVENT, cropperState.uploadResult, props.field, props.ki)
                    break
                // 上传失败
                case 4:
                    emit(CROP_UPLOAD_FAIL_EVENT, cropperState.uploadResult, props.field, props.ki)
                    break
                default:
                    break
            }
        })
        watch(() => props.modelValue, (val) => {
            val ? on() : off()
        })

        onBeforeUnmount(() => {
            document.removeEventListener('keyup', handleEscClose)
        })

        provide(wizardKey, {
            step,
            close
        })
        provide(stateKey, cropperState)
        provide(sharedKey, {
            lang,
            mime
        })

        init()

        return {
            componentName,
            close
        }
    },
})
</script>

<style lang="scss">
@import "./scss/upload.scss";
</style>
