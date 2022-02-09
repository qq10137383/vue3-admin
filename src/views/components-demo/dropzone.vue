<template>
    <div class="components-container">
        <aside>
            Based on
            <a class="link-type" href="https://github.com/rowanwins/vue-dropzone">dropzone</a>.
            Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.
        </aside>
        <div class="editor-container">
            <dropzone
                id="myVueDropzone"
                url="https://httpbin.org/post"
                @dropzone-removedFile="dropzoneR"
                @dropzone-success="dropzoneS"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { DropzoneFile } from 'dropzone'
import Dropzone from '@/components/Dropzone/index.vue'

export default defineComponent({
    name: 'DropzoneDemo',
    components: {
        Dropzone
    },
    setup() {
        function dropzoneS(file: DropzoneFile) {
            console.log(file)
            ElMessage({ message: 'Upload success', type: 'success' })
        }
        function dropzoneR(file: DropzoneFile) {
            console.log(file)
            ElMessage({ message: 'Delete success', type: 'success' })
        }

        return {
            dropzoneS,
            dropzoneR
        }
    },
})
</script>
