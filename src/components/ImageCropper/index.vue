<template>
    <teleport to="body">
        <transition name="vicp">
            <div class="vue-image-crop-upload" v-show="modelValue">
                <div class="vicp-wrap">
                    <div class="vicp-close" @click="off">
                        <i class="vicp-icon4"></i>
                    </div>
                    <keep-alive>
                        <component :is="componentName" v-bind="$props" />
                    </keep-alive>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, provide, getCurrentInstance } from 'vue'
import language from './utils/language'
import mimes, { MimeType } from './utils/mimes'
import { stepKey, langKey, mimeKey, closeKey } from './utils/tokens'
import { MODEL_EVENT } from '@/utils/constants'
import { useStep } from '@/hooks/use-step'
import DropArea from './steps/drop-area.vue'

export default defineComponent({
    components: {
        DropArea
    },
    props: {
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
    },
    emits: [MODEL_EVENT],
    setup(props, { emit }) {
        const step = useStep()

        const componentName = computed(() => {
            const steps = (getCurrentInstance()?.type as any).components
            return Object.keys(steps).find(
                (m) => steps[m].stepIndex === step.current.value
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

        function off() {
            emit(MODEL_EVENT, false)
        }

        provide(stepKey, step)
        provide(langKey, lang)
        provide(mimeKey, mime)
        provide(closeKey, off)

        return {
            componentName,
            off
        }
    },
})
</script>

<style lang="scss">
@import "./scss/upload.scss";
</style>
