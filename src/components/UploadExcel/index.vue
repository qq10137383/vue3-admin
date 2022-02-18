<template>
    <div>
        <input
            ref="uploadRef"
            class="excel-upload-input"
            type="file"
            accept=".xlsx, .xls"
            @change="handleClick"
        />
        <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
            Drop excel file here or
            <el-button
                :loading="loading"
                style="margin-left:16px;"
                size="small"
                type="primary"
                @click="handleUpload"
            >Browse</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { utils, read, Sheet } from 'xlsx'

export interface ExcelData {
    header: string[] | null,
    results: any[] | null
}

export default defineComponent({
    name: "UploadExcel",
    props: {
        beforeUpload: {
            type: Function as PropType<(data: File) => boolean>
        },
        onSuccess: {
            type: Function as PropType<(data: ExcelData) => any>
        }
    },
    setup(props) {
        const excelData: ExcelData = {
            header: null,
            results: null
        }

        const loading = ref(false)
        const uploadRef = ref<HTMLInputElement>()

        function generateData({ header, results }: ExcelData) {
            excelData.header = header
            excelData.results = results
            props.onSuccess && props.onSuccess(excelData)
        }
        function getHeaderRow(sheet: Sheet) {
            const headers = []
            const range = utils.decode_range(sheet['!ref']!)
            let c
            const r = range.s.r
            /* start in the first row */
            for (c = range.s.c; c <= range.e.c; ++c) { /* walk every column in the range */
                const cell = sheet[utils.encode_cell({ c: c, r: r })]
                /* find the cell in the first row */
                let hdr = 'UNKNOWN ' + c // <-- replace with your desired default
                if (cell && cell.t) hdr = utils.format_cell(cell)
                headers.push(hdr)
            }
            return headers
        }
        function readerData(rawFile: File): Promise<ExcelData> {
            loading.value = true
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = e => {
                    const data = e.target!.result
                    const workbook = read(data, { type: 'array' })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const header = getHeaderRow(worksheet)
                    const results = utils.sheet_to_json(worksheet)
                    generateData({ header, results })
                    loading.value = false
                    resolve(excelData)
                }
                reader.readAsArrayBuffer(rawFile)
            })
        }
        function isExcel(file: File) {
            return /\.(xlsx|xls|csv)$/.test(file.name)
        }
        function upload(rawFile: File) {
            uploadRef.value!.value = "" // fix can't select the same excel

            if (!props.beforeUpload) {
                readerData(rawFile)
                return
            }
            const before = props.beforeUpload(rawFile)
            if (before) {
                readerData(rawFile)
            }
        }
        function handleClick(e: Event) {
            const files = (e.target as HTMLInputElement).files
            const rawFile = files![0] // only use files[0]
            if (!rawFile) return
            upload(rawFile)
        }
        function handleDrop(e: DragEvent) {
            e.stopPropagation()
            e.preventDefault()
            if (loading.value) return
            const files = e.dataTransfer!.files
            if (files.length !== 1) {
                ElMessage.error('Only support uploading one file!')
                return
            }
            const rawFile = files[0] // only use files[0]

            if (isExcel(rawFile)) {
                ElMessage.error('Only supports upload .xlsx, .xls, .csv suffix files')
                return false
            }
            upload(rawFile)
        }
        function handleDragover(e: DragEvent) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer!.dropEffect = 'copy'
        }
        function handleUpload() {
            uploadRef.value!.click()
        }
        return {
            loading,
            uploadRef,
            handleClick,
            handleDrop,
            handleDragover,
            handleUpload
        }
    },
})
</script>


<style scoped>
.excel-upload-input {
    display: none;
    z-index: -9999;
}
.drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
}
</style>
