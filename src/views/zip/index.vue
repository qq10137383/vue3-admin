<template>
    <div class="app-container">
        <el-input
            v-model="filename"
            placeholder="Please enter the file name (default file)"
            style="width:300px;"
            prefix-icon="el-icon-document"
        />
        <el-button
            :loading="downloadLoading"
            style="margin:14px 0 20px 20px;"
            type="primary"
            icon="el-icon-document"
            @click="handleDownload"
        >Export Zip</el-button>
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="拼命加载中"
            border
            fit
            highlight-current-row
        >
            <el-table-column align="center" label="ID" width="95">
                <template v-slot="scope">{{ scope.$index }}</template>
            </el-table-column>
            <el-table-column label="Title">
                <template v-slot="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column label="Author" width="95" align="center">
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
                    <i class="el-icon-time" />
                    <span>{{ scope.row.display_time }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Timer } from '@element-plus/icons-vue'
import { fetchList, Article } from '@/api/article'
import type { KeyArray } from '@/utils/types'

export default defineComponent({
    components: {
        Timer
    },
    setup() {
        const listLoading = ref(false)
        const downloadLoading = ref(false)
        const list = ref<Article[]>([])
        const filename = ref('')

        function fetchData() {
            listLoading.value = true
            fetchList().then(response => {
                list.value = response.data.items
                listLoading.value = false
            })
        }
        function formatJson<T, K extends keyof T>(filterVal: K[], jsonData: T[]) {
            return jsonData.map(v => filterVal.map(j => v[j]).toString())
        }
        function handleDownload() {
            downloadLoading.value = true
            import('@/vendor/Export2Zip').then(zip => {
                const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
                const filterVal: KeyArray<Article> = ['id', 'title', 'author', 'pageviews', 'display_time']
                const data = formatJson(filterVal, list.value)
                zip.export_txt_to_zip(tHeader.toString(), data, filename.value, filename.value)
                downloadLoading.value = false
            })
        }

        fetchData()

        return {
            listLoading,
            downloadLoading,
            list,
            filename,
            handleDownload
        }
    },
})
</script>
