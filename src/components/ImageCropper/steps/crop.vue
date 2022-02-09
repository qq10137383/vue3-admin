<template>
    <div class="vicp-step2">
        <div class="vicp-crop">
            <div class="vicp-crop-left">
                <div class="vicp-img-container" @wheel.prevent="handleMouseWheel">
                    <img
                        :src="cropperState.sourceImgUrl"
                        :style="sourceImgStyle"
                        class="vicp-img"
                        draggable="false"
                        @drag="preventDefault"
                        @dragstart="preventDefault"
                        @dragend="preventDefault"
                        @dragleave="preventDefault"
                        @dragover="preventDefault"
                        @dragenter="preventDefault"
                        @drop="preventDefault"
                        @touchstart="imgStartMove"
                        @touchmove="imgMove"
                        @touchend="createImg"
                        @touchcancel="createImg"
                        @mousedown="imgStartMove"
                        @mousemove="imgMove"
                        @mouseup="createImg"
                        @mouseout="createImg"
                        ref="img"
                    />
                    <div class="vicp-img-shade vicp-img-shade-1" :style="sourceImgShadeStyle"></div>
                    <div class="vicp-img-shade vicp-img-shade-2" :style="sourceImgShadeStyle"></div>
                </div>

                <div class="vicp-range">
                    <input
                        type="range"
                        v-model="scale.range"
                        step="1"
                        min="0"
                        max="100"
                        @mousemove="zoomChange"
                    />
                    <i
                        @mousedown="startZoomSub"
                        @mouseout="endZoomSub"
                        @mouseup="endZoomSub"
                        class="vicp-icon5"
                    ></i>
                    <i
                        @mousedown="startZoomAdd"
                        @mouseout="endZoomAdd"
                        @mouseup="endZoomAdd"
                        class="vicp-icon6"
                    ></i>
                </div>

                <div class="vicp-rotate" v-if="!$attrs.noRotate">
                    <i @click="rotateImg">↻</i>
                </div>
            </div>
            <div class="vicp-crop-right">
                <div class="vicp-preview">
                    <div class="vicp-preview-item" v-if="!$attrs.noSquare">
                        <img :src="cropperState.createImgUrl" :style="previewStyle" />
                        <span>{{ lang.preview }}</span>
                    </div>
                    <div class="vicp-preview-item vicp-preview-item-circle" v-if="!$attrs.noCircle">
                        <img :src="cropperState.createImgUrl" :style="previewStyle" />
                        <span>{{ lang.preview }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="vicp-error" v-show="hasError">
            <i class="vicp-icon2"></i>
            {{ errorMsg }}
        </div>
        <div class="vicp-operate">
            <a @click="step.previous()" @mousedown="ripple">{{ lang.btn.back }}</a>
            <a
                class="vicp-operate-btn"
                @click="prepareUpload"
                @mousedown="ripple"
            >{{ lang.btn.save }}</a>
        </div>
        <canvas ref="canvasRef" v-show="false" :width="width" :height="height"></canvas>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, inject, computed, getCurrentInstance, onMounted } from 'vue'
import { wizardKey, stateKey, sharedKey } from '../utils/tokens'
import mimes from '../utils/mimes'
import { preventDefault } from '../utils/common'
import ripple from '../utils/effectRipple'
import type { CropperProps } from '../index.vue'

// 图片裁剪
export default defineComponent({
    inheritAttrs: false,
    __stepIndex: 3,
    setup() {
        const { step, close } = inject(wizardKey)!
        const { lang, mime } = inject(sharedKey)!
        const cropperState = inject(stateKey)!

        const instance = getCurrentInstance()
        const parentProps = instance!.proxy!.$attrs as CropperProps
        const isSupportTouch = 'ontouchstart' in document
        // 原图片
        let sourceImg: HTMLImageElement | null = null
        // 原图容器宽高
        const sourceImgContainer = { // sic
            width: 240,
            height: 184 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
        }
        // 原图片拖动事件初始值
        const sourceImgMouseDown = {
            on: false,
            mX: 0, //鼠标按下的坐标
            mY: 0,
            x: 0, //scale原图坐标
            y: 0
        }
        // 生成图片预览的容器大小
        const previewContainer = {
            width: 100,
            height: 100
        }

        // canvas
        const canvasRef = ref<HTMLCanvasElement>()
        // 在模板中使用$attrs.width、$attrs.height时，ts检查模板报类型错误，显式声明一下
        const { width: pWidth, height: pHeight } = toRefs(parentProps)
        // 原图展示属性
        const scale = reactive({
            zoomAddOn: false, //按钮缩放事件开启
            zoomSubOn: false, //按钮缩放事件开启
            range: 1, //最大100
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            maxWidth: 0,
            maxHeight: 0,
            minWidth: 0, //最宽
            minHeight: 0,
            naturalWidth: 0, //原宽
            naturalHeight: 0
        })
        const hasError = ref(false)
        const errorMsg = ref('')

        // 需求图宽高比
        const ratio = computed(() => {
            return pWidth.value / pHeight.value
        })
        // 原图蒙版属性
        const sourceImgMasking = computed(() => {
            const sic = sourceImgContainer
            const sicRatio = sic.width / sic.height // 原图容器宽高比
            let x = 0, y = 0, w = sic.width, h = sic.height, sc = 1
            if (ratio.value < sicRatio) {
                sc = sic.height / pHeight.value
                w = sic.height * ratio.value
                x = (sic.width - w) / 2
            }
            if (ratio.value > sicRatio) {
                sc = sic.width / pWidth.value
                h = sic.width / ratio.value
                y = (sic.height - h) / 2
            }
            return {
                scale: sc, // 蒙版相对需求宽高的缩放
                x,
                y,
                width: w,
                height: h
            }
        })
        // 原图样式
        const sourceImgStyle = computed(() => {
            const sim = sourceImgMasking.value
            const top = scale.y + sim.y + 'px'
            const left = scale.x + sim.x + 'px'
            return {
                top,
                left,
                width: scale.width + 'px',
                height: scale.height + 'px',// 兼容 Opera
            }
        })
        // 原图遮罩样式
        const sourceImgShadeStyle = computed(() => {
            const sic = sourceImgContainer
            const sim = sourceImgMasking.value
            const w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2
            const h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2
            return {
                width: w + 'px',
                height: h + 'px'
            }
        })
        // 生成图片样式
        const previewStyle = computed(() => {
            const pc = previewContainer
            let w = pc.width, h = pc.height
            const pcRatio = w / h
            if (ratio.value < pcRatio) {
                w = pc.height * ratio.value
            }
            if (ratio.value > pcRatio) {
                h = pc.width / ratio.value
            }
            return {
                width: w + 'px',
                height: h + 'px'
            }
        })

        // 生成需求图片
        function createImg(e?: MouseEvent | TouchEvent) {
            const { x, y, width: sw, height: sh } = scale
            const { imgFormat, imgBgc } = parentProps
            const sc = sourceImgMasking.value.scale

            const canvas = canvasRef.value!
            const ctx = canvas.getContext('2d')!
            if (e) {
                // 取消鼠标按下移动状态
                sourceImgMouseDown.on = false
            }
            canvas.width = pWidth.value
            canvas.height = pHeight.value

            ctx.clearRect(0, 0, pWidth.value, pHeight.value)
            if (imgFormat == 'png') {
                ctx.fillStyle = 'rgba(0,0,0,0)'
            } else {
                // 如果jpg 为透明区域设置背景，默认白色
                ctx.fillStyle = imgBgc
            }
            ctx.fillRect(0, 0, pWidth.value, pHeight.value)
            ctx.drawImage(sourceImg!, x / sc, y / sc, sw / sc, sh / sc)

            cropperState.createImgUrl = canvas.toDataURL(mime.value)
        }
        // 剪裁前准备工作
        function startCrop() {
            const sim = sourceImgMasking.value
            const img = new Image()
            img.src = cropperState.sourceImgUrl!
            img.onload = function () {
                const nWidth = img.naturalWidth,
                    nHeight = img.naturalHeight,
                    nRatio = nWidth / nHeight
                let w = sim.width,
                    h = sim.height,
                    x = 0,
                    y = 0

                // 图片像素不达标
                if (nWidth < pWidth.value || nHeight < pHeight.value) {
                    hasError.value = true
                    errorMsg.value = lang.value.error.lowestPx + pWidth.value + '*' + pHeight.value
                    return false
                }
                if (ratio.value > nRatio) {
                    h = w / nRatio
                    y = (sim.height - h) / 2
                }
                if (ratio.value < nRatio) {
                    w = h * nRatio
                    x = (sim.width - w) / 2
                }
                scale.range = 0
                scale.x = x
                scale.y = y
                scale.width = w
                scale.height = h
                scale.minWidth = w
                scale.minHeight = h
                scale.maxWidth = nWidth * sim.scale
                scale.maxHeight = nHeight * sim.scale
                scale.naturalWidth = nWidth
                scale.naturalHeight = nHeight
                sourceImg = img
                createImg()
            }
        }
        // 顺时针旋转图片
        function rotateImg() {
            const { naturalHeight, naturalWidth } = scale
            const width = naturalHeight, height = naturalWidth

            const canvas = canvasRef.value!
            const ctx = canvas.getContext('2d')!
            canvas.width = width
            canvas.height = height

            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'rgba(0,0,0,0)'
            ctx.fillRect(0, 0, width, height)
            ctx.translate(width, 0)
            ctx.rotate(Math.PI * 90 / 180)
            ctx.drawImage(sourceImg!, 0, 0, naturalWidth, naturalHeight)

            let imgUrl = canvas.toDataURL(mimes['png'])
            cropperState.sourceImgUrl = imgUrl
            startCrop()
        }
        // 缩放原图
        function zoomImg(newRange: number) {
            const { maxWidth, maxHeight, minWidth, minHeight, width, height, x, y } = scale
            const sim = sourceImgMasking.value
            // 蒙版宽高
            const sWidth = sim.width, sHeight = sim.height
            // 新宽高
            const nWidth = minWidth + (maxWidth - minWidth) * newRange / 100
            const nHeight = minHeight + (maxHeight - minHeight) * newRange / 100
            // 新坐标（根据蒙版中心点缩放）
            let nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x)
            let nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y)
            // 判断新坐标是否超过蒙版限制
            if (nX > 0) {
                nX = 0
            }
            if (nY > 0) {
                nY = 0
            }
            if (nX < sWidth - nWidth) {
                nX = sWidth - nWidth
            }
            if (nY < sHeight - nHeight) {
                nY = sHeight - nHeight
            }
            // 赋值处理
            scale.x = nX
            scale.y = nY
            scale.width = nWidth
            scale.height = nHeight
            scale.range = newRange
            setTimeout(function () {
                if (scale.range == newRange) {
                    createImg()
                }
            }, 300)
        }
        // 滚轮放缩
        function handleMouseWheel(e: WheelEvent) {
            e = e || window.event
            if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
                if (e.wheelDelta > 0) { //当滑轮向上滚动时
                    zoomImg(scale.range >= 100 ? 100 : ++scale.range)
                }
                if (e.wheelDelta < 0) {
                    zoomImg(scale.range <= 0 ? 0 : --scale.range)
                }
            } else if (e.detail) {  //Firefox滑轮事件
                if (e.detail > 0) { //当滑轮向上滚动时
                    zoomImg(scale.range >= 100 ? 100 : ++scale.range)
                }
                if (e.detail < 0) {
                    zoomImg(scale.range <= 0 ? 0 : --scale.range)
                }
            }
        }
        // 事件预处理
        function payloadEvent(e: MouseEvent | TouchEvent) {
            e.preventDefault()
            // 支持触摸事件，则鼠标事件无效
            let et: MouseEvent | Touch | undefined
            if (isSupportTouch) {
                if (e instanceof TouchEvent && e.targetTouches && e.targetTouches.length) {
                    et = e.targetTouches[0]
                }
            }
            else {
                et = e as MouseEvent
            }
            return et
        }
        // 鼠标按下图片准备移动
        function imgStartMove(e: MouseEvent | TouchEvent) {
            const et = payloadEvent(e)
            if (!et) return false

            const simd = sourceImgMouseDown
            simd.mX = et.screenX
            simd.mY = et.screenY
            simd.x = scale.x
            simd.y = scale.y
            simd.on = true
        }
        // 鼠标按下状态下移动，图片移动
        function imgMove(e: MouseEvent | TouchEvent) {
            const et = payloadEvent(e)
            if (!et) return false

            const { on, mX, mY, x, y } = sourceImgMouseDown
            const sim = sourceImgMasking.value
            const nX = et.screenX, nY = et.screenY,
                dX = nX - mX, dY = nY - mY
            let rX = x + dX, rY = y + dY
            if (!on) return
            if (rX > 0) {
                rX = 0
            }
            if (rY > 0) {
                rY = 0
            }
            if (rX < sim.width - scale.width) {
                rX = sim.width - scale.width
            }
            if (rY < sim.height - scale.height) {
                rY = sim.height - scale.height
            }
            scale.x = rX
            scale.y = rY
        }
        // 按钮按下开始放大
        function startZoomAdd() {
            scale.zoomAddOn = true
            function zoom() {
                if (scale.zoomAddOn) {
                    let range = scale.range >= 100 ? 100 : ++scale.range
                    zoomImg(range)
                    setTimeout(function () {
                        zoom()
                    }, 60)
                }
            }
            zoom()
        }
        // 按钮松开或移开取消放大
        function endZoomAdd() {
            scale.zoomAddOn = false
        }
        // 按钮按下开始缩小
        function startZoomSub() {
            scale.zoomSubOn = true
            function zoom() {
                if (scale.zoomSubOn) {
                    let range = scale.range <= 0 ? 0 : --scale.range
                    zoomImg(range)
                    setTimeout(function () {
                        zoom()
                    }, 60)
                }
            }
            zoom()
        }
        // 按钮松开或移开取消缩小
        function endZoomSub() {
            scale.zoomSubOn = false
        }
        function zoomChange(e: MouseEvent) {
            const ratio = Number((e.target as HTMLInputElement).value)
            zoomImg(ratio)
        }
        function prepareUpload() {
            cropperState.currentState = 1
            const { url } = parentProps
            if (typeof url == 'string' && url) {
                step.next()
            } else {
                close()
            }
        }

        onMounted(() => {
            if (cropperState.sourceImgUrl) {
                startCrop()
            }
        })

        return {
            step,
            lang,
            cropperState,
            canvasRef,
            scale,
            width: pWidth,
            height: pHeight,
            hasError,
            errorMsg,
            sourceImgStyle,
            sourceImgShadeStyle,
            previewStyle,
            preventDefault,
            ripple,
            createImg,
            rotateImg,
            handleMouseWheel,
            imgStartMove,
            imgMove,
            startZoomAdd,
            endZoomAdd,
            startZoomSub,
            endZoomSub,
            zoomChange,
            prepareUpload
        }
    }
})
</script>
