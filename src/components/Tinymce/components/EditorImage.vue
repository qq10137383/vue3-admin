<template>
    <div class="upload-container">
        <el-button
            :style="{ background: color, borderColor: color }"
            icon="el-icon-upload"
            size="small"
            type="primary"
            @click="dialogVisible = true"
        >upload</el-button>
        <el-dialog v-model="dialogVisible">
            <el-upload
                :multiple="true"
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                class="editor-slide-upload"
                action="https://httpbin.org/post"
                list-type="picture-card"
            >
                <el-button size="small" type="primary">Click upload</el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFile, ElFile } from 'element-plus/es/components/upload/src/upload.type'

export type CustomUploadFile = Partial<UploadFile
    & {
        hasSuccess: boolean,
        width: number,
        height: number
    }>

const SUCCESS_EVENT = 'successCBK'

export default defineComponent({
    name: 'EditorSlideUpload',
    props: {
        color: {
            type: String,
            default: '#1890ff'
        }
    },
    emits: [SUCCESS_EVENT],
    setup(_, { emit }) {
        let listObj: Record<string, CustomUploadFile> = {}

        const dialogVisible = ref(false)
        const fileList = ref<UploadFile[]>([])

        function checkAllSuccess() {
            return Object.keys(listObj).every(item => listObj[item].hasSuccess)
        }
        function handleSubmit() {
            const arr = Object.keys(listObj).map(v => listObj[v])
            if (!checkAllSuccess()) {
                ElMessage('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
                return
            }
            emit(SUCCESS_EVENT, arr)
            listObj = {}
            fileList.value = []
            dialogVisible.value = false
        }
        function handleSuccess(response: any, file: UploadFile) {
            const uid = file.uid
            const objKeyArr = Object.keys(listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (listObj[objKeyArr[i]].uid === uid) {
                    listObj[objKeyArr[i]].url = response.files.file
                    listObj[objKeyArr[i]].hasSuccess = true
                    return
                }
            }
        }
        function handleRemove(file: UploadFile) {
            const uid = file.uid
            const objKeyArr = Object.keys(listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (listObj[objKeyArr[i]].uid === uid) {
                    delete listObj[objKeyArr[i]]
                    return
                }
            }
        }
        function beforeUpload(file: ElFile) {
            const _URL = window.URL || window.webkitURL
            const fileName = file.uid
            listObj[fileName] = {}
            return new Promise((resolve) => {
                const img = new Image()
                img.src = _URL.createObjectURL(file)
                img.onload = function () {
                    listObj[fileName] = { hasSuccess: false, uid: file.uid, width: img.width, height: img.height }
                }
                resolve(true)
            })
        }

        return {
            dialogVisible,
            fileList,
            handleSubmit,
            handleSuccess,
            handleRemove,
            beforeUpload
        }
    },
})
</script>

<style lang="scss" scoped>
.editor-slide-upload {
    margin-bottom: 20px;
    ::v-deep(.el-upload--picture-card) {
        width: 100%;
        height: 148px;
        line-height: 146px;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        vertical-align: top;
    }
}
</style>
