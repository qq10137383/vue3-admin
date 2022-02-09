<template>
    <div class="components-container">
        <aside>
            This is based on
            <a
                class="link-type"
                href="//github.com/dai-siki/vue-image-crop-upload"
            >vue-image-crop-upload</a>.
            rewritten using the vue3 composition api based on the latest version of the original author, split into multiple step components
        </aside>

        <pan-thumb :image="image" />

        <el-button
            type="primary"
            icon="el-icon-upload"
            style="position: absolute;bottom: 15px;margin-left: 40px;"
            @click="imagecropperShow = true"
        >Change Avatar</el-button>

        <image-cropper
            v-model="imagecropperShow"
            :width="300"
            :height="300"
            url="https://httpbin.org/post"
            lang-type="en"
            @crop-upload-success="cropSuccess"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ImageCropper from '@/components/ImageCropper/index.vue'
import PanThumb from '@/components/PanThumb/index.vue'

export default defineComponent({
    name: 'AvatarUploadDemo',
    components: {
        PanThumb,
        ImageCropper
    },
    setup() {
        const imagecropperShow = ref(false)
        const image = ref('https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191')

        function cropSuccess(resData: any) {
            image.value = resData.files.avatar
            imagecropperShow.value = false
        }

        return {
            imagecropperShow,
            image,
            cropSuccess
        }
    },
})
</script>
