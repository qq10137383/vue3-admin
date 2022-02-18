<template>
    <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <el-table
            :data="tableData"
            border
            highlight-current-row
            style="width: 100%;margin-top:20px;"
        >
            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import UploadExcelComponent, { ExcelData } from '@/components/UploadExcel/index.vue'

export default defineComponent({
    name: "UploadExcelDemo",
    components: {
        UploadExcelComponent
    },
    setup() {
        const tableData = ref<any[]>([])
        const tableHeader = ref<string[]>([])

        function beforeUpload(file: File) {
            const isLt1M = file.size / 1024 / 1024 < 1

            if (isLt1M) {
                return true
            }

            ElMessage({
                message: 'Please do not upload files larger than 1m in size.',
                type: 'warning'
            })
            return false
        }
        function handleSuccess({ results, header }: ExcelData) {
            tableData.value = results || []
            tableHeader.value = header || []
        }

        return {
            tableData,
            tableHeader,
            beforeUpload,
            handleSuccess
        }
    },
})
</script>
