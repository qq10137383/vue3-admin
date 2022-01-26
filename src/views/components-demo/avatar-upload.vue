<template>
    <div class="components-container">
        <aside>
            This is based on
            <a
                class="link-type"
                href="//github.com/dai-siki/vue-image-crop-upload"
            >vue-image-crop-upload</a>.
            Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.
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
            :key="imagecropperKey"
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
        const imagecropperKey = ref(0)
        const image = ref('https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191')

        function cropSuccess(resData: any) {
            imagecropperShow.value = false
            imagecropperKey.value = imagecropperKey.value + 1
            image.value = resData.files.avatar
        }

        return {
            imagecropperShow,
            imagecropperKey,
            image,
            cropSuccess,
            close
        }
    },
})
</script>
