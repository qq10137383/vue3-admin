<template>
    <div class="app-container">
        <el-button
            :loading="downloadLoading"
            style="margin-bottom:20px"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
        >Export</el-button>

        <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
        >
            <el-table-column align="center" label="Id" width="95">
                <template v-slot="scope">{{ scope.$index }}</template>
            </el-table-column>
            <el-table-column label="Main Information" align="center">
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
            </el-table-column>
            <el-table-column align="center" label="Date" width="220">
                <template v-slot="scope">
                    <i class="el-icon-time" />
                    <span>{{ $filters.parseTime(scope.row.timestamp, '{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { fetchList, Article } from '@/api/article'
import type { KeyArray } from '@/utils/types'
import { parseTime } from '@/utils'

export default defineComponent({
    name: 'MergeHeader',
    setup() {
        const listLoading = ref(false)
        const downloadLoading = ref(false)
        const list = ref<Article[]>([])

        function fetchData() {
            listLoading.value = true
            fetchList().then(response => {
                list.value = response.data.items
                listLoading.value = false
            })
        }
        function formatJson<T, K extends keyof T>(filterVal: K[], jsonData: T[]) {
            return jsonData.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                    return parseTime(v[j] as any)
                } else {
                    return v[j]
                }
            }))
        }
        function handleDownload() {
            downloadLoading.value = true
            import('@/vendor/Export2Excel').then(excel => {
                const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
                const header = ['', 'Title', 'Author', 'Readings', '']
                const filterVal: KeyArray<Article> = ['id', 'title', 'author', 'pageviews', 'display_time']
                const data = formatJson(filterVal, list.value)
                const merges = ['A1:A2', 'B1:D1', 'E1:E2']
                excel.export_json_to_excel({
                    multiHeader,
                    header,
                    merges,
                    data
                })
                downloadLoading.value = false
            })
        }

        fetchData()

        return {
            listLoading,
            downloadLoading,
            list,
            handleDownload
        }
    },
})
</script>
