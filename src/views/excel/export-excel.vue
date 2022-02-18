<template>
    <div class="app-container">
        <div>
            <FilenameOption v-model="filename" />
            <AutoWidthOption v-model="autoWidth" />
            <BookTypeOption v-model="bookType" />
            <el-button
                :loading="downloadLoading"
                style="margin:14px 0 20px 20px;"
                type="primary"
                icon="el-icon-document"
                @click="handleDownload"
            >Export Excel</el-button>
            <a
                href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html"
                target="_blank"
                style="margin-left:15px;"
            >
                <el-tag type="info">Documentation</el-tag>
            </a>
        </div>

        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading..."
            border
            fit
            highlight-current-row
        >
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
            <el-table-column align="center" label="Date" width="220">
                <template v-slot="scope">
                    <el-icon>
                        <Timer />
                    </el-icon>
                    <span>{{ $filters.parseTime(scope.row.timestamp, '{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { fetchList, Article } from '@/api/article'
import { parseTime } from '@/utils'
import type { KeyArray } from '@/utils/types'
import { Timer } from '@element-plus/icons-vue'
// options components
import FilenameOption from './components/FilenameOption.vue'
import AutoWidthOption from './components/AutoWidthOption.vue'
import BookTypeOption, { ExcelFormat } from './components/BookTypeOption.vue'

export default defineComponent({
    components: {
        FilenameOption,
        AutoWidthOption,
        BookTypeOption,
        Timer
    },
    setup() {
        const listLoading = ref(false)
        const downloadLoading = ref(false)
        const list = ref<Article[]>([])
        const optionState = reactive({
            filename: '',
            autoWidth: true,
            bookType: 'xlsx' as ExcelFormat
        })

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
                const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
                const filterVal: KeyArray<Article> = ['id', 'title', 'author', 'pageviews', 'display_time']
                const data = formatJson(filterVal, list.value)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    ...optionState
                })
                downloadLoading.value = false
            })
        }

        fetchData()

        return {
            listLoading,
            downloadLoading,
            list,
            ...toRefs(optionState),
            handleDownload
        }
    },
})
</script>

<style>
.radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
}
</style>
