<template>
    <div class="vicp-step1">
        <div
            class="vicp-drop-area"
            @dragleave="preventDefault"
            @dragover="preventDefault"
            @dragenter="preventDefault"
            @click="handleClick"
            @drop="handleChange"
        >
            <i class="vicp-icon1">
                <i class="vicp-icon1-arrow"></i>
                <i class="vicp-icon1-body"></i>
                <i class="vicp-icon1-bottom"></i>
            </i>
            <span class="vicp-hint">{{ lang.hint }}</span>
            <span class="vicp-no-supported-hint" v-show="!isSupported">{{ lang.noSupported }}</span>
            <input
                ref="fileinputRef"
                type="file"
                accept="image/*"
                v-show="false"
                @change="handleChange"
            />
        </div>
        <div class="vicp-error" v-show="hasError">
            <i class="vicp-icon2"></i>
            {{ errorMsg }}
        </div>
        <div class="vicp-operate">
            <a @click="off" @mousedown="ripple">{{ lang.btn.off }}</a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, getCurrentInstance } from 'vue'
import { langKey, closeKey } from '../utils/tokens'
import { preventDefault } from '../utils/common'
import ripple from '../utils/effectRipple'

export default defineComponent({
    stepIndex: 1,
    setup() {
        const instance = getCurrentInstance();
        const isSupported = typeof FormData == 'function'

        const lang = inject(langKey)!
        const off = inject(closeKey)!

        const hasError = ref(false)
        const errorMsg = ref('')
        const fileinputRef = ref<HTMLInputElement>()

        // 检测选择的文件是否合适
        function checkFile(file: File) {
            // 仅限图片
            if (file.type.indexOf('image') === -1) {
                hasError.value = true;
                errorMsg.value = lang.value.error.onlyImg;
                return false;
            }
            // 超出大小
            const maxSize = instance?.attrs?.maxSize as number
            if (file.size / 1024 > maxSize) {
                hasError.value = true;
                errorMsg.value = lang.value.error.outOfSize + maxSize + 'kb';
                return false;
            }
            return true;
        }
        // 设置图片源
        function setSourceImg(file: File) {
            const fr = new FileReader();
            fr.onload = () => {
                console.log(fr.result)
            }
            fr.readAsDataURL(file);
        }
        function reset() {
            hasError.value = false;
            errorMsg.value = '';
        }
        function handleClick(e: MouseEvent) {
            if (e.target !== fileinputRef.value) {
                e.preventDefault();
                fileinputRef.value!.click();
            }
        }
        function handleChange(e: Event) {
            reset();
            e.preventDefault();

            let files: FileList
            if (e instanceof DragEvent) {
                files = e.dataTransfer!.files
            }
            else {
                files = (e.target as HTMLInputElement).files!
            }
            if (files.length > 0 && checkFile(files[0])) {
                setSourceImg(files[0]);
            }
        }

        return {
            isSupported,
            lang,
            off,
            hasError,
            errorMsg,
            fileinputRef,
            handleClick,
            handleChange,
            preventDefault,
            ripple
        }
    },
})
</script>
