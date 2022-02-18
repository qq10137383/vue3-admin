<template>
    <div class="app-container">
        <el-input
            v-model="filename"
            placeholder="Please enter the file name (default excel-list)"
            style="width:350px;"
            prefix-icon="el-icon-document"
        />
        <el-button
            :loading="downloadLoading"
            style="margin:14px 0 20px 20px;"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
        >Export Selected Items</el-button>
        <a
            href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html"
            target="_blank"
            style="margin-left:15px;"
        >
            <el-tag type="info">Documentation</el-tag>
        </a>
        <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" align="center" />
            <el-table-column align="center" label="Id" width="95">
                <template v-slot="scope">{{ scope.$index }}</template>
            </el-table-column>
            <el-table-column label="Title">
                <template v-slot="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column label="Author" width="110" align="center">
                <template v-slot="scope">
                    <el-tag>{{ scope.row.author }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Readings" width="115" align="center">
                <template v-slot="scope">{{ scope.row.pageviews }}</template>
            </el-table-column>
            <el-table-column align="center" label="PDate" width="220">
                <template v-slot="scope">
                    <i class="el-icon-time" />
                    <span>{{ scope.row.display_time }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { fetchList, Article } from '@/api/article'
import type { KeyArray } from '@/utils/types'

export default defineComponent({
    name: 'SelectExcel',
    setup() {
        let multipleSelection: any[] = []

        const listLoading = ref(false)
        const downloadLoading = ref(false)
        const list = ref<Article[]>([])
        const filename = ref('')
        const multipleTable = ref<InstanceType<typeof ElTable>>()

        function fetchData() {
            listLoading.value = true
            fetchList().then(response => {
                list.value = response.data.items
                listLoading.value = false
            })
        }
        function handleSelectionChange(val: any[]) {
            multipleSelection = val
        }
        function formatJson<T, K extends keyof T>(filterVal: K[], jsonData: T[]) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
        function handleDownload() {
            if (multipleSelection.length) {
                downloadLoading.value = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
                    const filterVal: KeyArray<Article> = ['id', 'title', 'author', 'pageviews', 'display_time']
                    const data = formatJson(filterVal, multipleSelection)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: filename.value
                    })
                    multipleTable.value!.clearSelection()
                    downloadLoading.value = false
                })
            } else {
                ElMessage({
                    message: 'Please select at least one item',
                    type: 'warning'
                })
            }
        }

        fetchData()

        return {
            listLoading,
            downloadLoading,
            list,
            filename,
            multipleTable,
            handleSelectionChange,
            handleDownload
        }
    },
})
</script>
