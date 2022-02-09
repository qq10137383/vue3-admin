<template>
    <div class="vicp-step3">
        <div class="vicp-upload">
            <span class="vicp-loading" v-show="cropperState.currentState === 2">{{ lang.loading }}</span>
            <div class="vicp-progress-wrap">
                <span
                    class="vicp-progress"
                    v-show="cropperState.currentState === 2"
                    :style="progressStyle"
                ></span>
            </div>
            <div class="vicp-error" v-show="hasError">
                <i class="vicp-icon2"></i>
                {{ errorMsg }}
            </div>
            <div class="vicp-success" v-show="cropperState.currentState === 3">
                <i class="vicp-icon3"></i>
                {{ lang.success }}
            </div>
        </div>
        <div class="vicp-operate">
            <a @click="step.previous()" @mousedown="ripple">{{ lang.btn.back }}</a>
            <a @click="close" @mousedown="ripple">{{ lang.btn.close }}</a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, getCurrentInstance, markRaw, onMounted } from 'vue'
import { wizardKey, stateKey, sharedKey } from '../utils/tokens'
import ripple from '../utils/effectRipple'
import data2blob from '../utils/data2blob'
import type { CropperProps } from '../index.vue'

// 图片上传
export default defineComponent({
    __stepIndex: 4,
    setup() {
        const { step, close } = inject(wizardKey)!
        const { lang, mime } = inject(sharedKey)!
        const cropperState = inject(stateKey)!

        const instance = getCurrentInstance()
        const parentProps = instance!.proxy!.$attrs as CropperProps

        const progress = ref(0)
        const hasError = ref(false)
        const errorMsg = ref('')

        // 进度条样式
        const progressStyle = computed(() => {
            return {
                width: progress.value + '%'
            }
        })

        // 重置控件
        function reset() {
            hasError.value = false
            errorMsg.value = ''
            progress.value = 0
        }
        // 监听进度回调
        function uploadProgress(event: ProgressEvent<XMLHttpRequestEventTarget>) {
            if (event.lengthComputable) {
                progress.value = 100 * Math.round(event.loaded) / event.total
            }
        }
        // 上传数据
        function uploadData(fmData: FormData) {
            return new Promise(function (resolve, reject) {
                const { method, url, withCredentials, headers } = parentProps
                const client = new XMLHttpRequest()

                client.open(method, url, true)
                client.withCredentials = withCredentials
                client.onreadystatechange = function () {
                    if (this.readyState !== 4) {
                        return
                    }
                    if ([200, 201, 202].includes(this.status)) {
                        resolve(JSON.parse(this.responseText))
                    } else {
                        reject(this.status)
                    }
                }
                client.upload.addEventListener('progress', uploadProgress)
                // 设置header
                if (typeof headers == 'object' && headers) {
                    Object.keys(headers).forEach((k) => {
                        client.setRequestHeader(k, headers[k])
                    })
                }
                client.send(fmData)
            })
        }
        // 开始上传
        function upload() {
            const { params, field, imgFormat } = parentProps
            const fmData = new FormData()

            // 添加其他参数
            if (typeof params == 'object' && params) {
                Object.keys(params).forEach((k) => {
                    fmData.append(k, params[k])
                })
            }

            // 将field的添加放到表单域的最后，以支持阿里云OSS的表单上传
            fmData.append(field, data2blob(cropperState.createImgUrl!, mime.value), field + '.' + imgFormat)

            // 上传文件
            reset()
            cropperState.currentState = 2
            uploadData(fmData).then(
                (resData: any) => {
                    if (cropperState.currentState != -1) {
                        cropperState.currentState = 3
                        cropperState.uploadResult = markRaw(resData)
                    }
                },
                (sts: number) => {
                    hasError.value = true
                    errorMsg.value = lang.value.fail
                    cropperState.currentState = 4
                    cropperState.uploadResult = sts
                }
            )
        }

        onMounted(() => {
            if (cropperState.createImgUrl) {
                upload()
            }
        })

        return {
            step,
            lang,
            cropperState,
            hasError,
            errorMsg,
            progressStyle,
            ripple,
            close
        }

    }
})
</script>
