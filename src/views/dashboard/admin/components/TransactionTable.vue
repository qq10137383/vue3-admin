<template>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
        <el-table-column label="Order_No" min-width="200">
            <template v-slot="scope">{{ orderNoFilter(scope.row.order_no) }}</template>
        </el-table-column>
        <el-table-column label="Price" width="195" align="center">
            <template v-slot="scope">¥{{ toThousandFilter(scope.row.price) }}</template>
        </el-table-column>
        <el-table-column label="Status" width="100" align="center">
            <template v-slot="{ row }">
                <el-tag :type="statusFilter(row.status)">{{ row.status }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TransactionVo, transactionList } from '@/api/remote-search'

export default defineComponent({
    setup() {
        const list = ref<TransactionVo[] | null>(null)

        function orderNoFilter(str: string) {
            return str.substring(0, 30)
        }
        function statusFilter(status: 'success' | 'pending') {
            const statusMap = {
                success: 'success',
                pending: 'danger'
            }
            return statusMap[status]
        }
        function fetchData() {
            transactionList().then(response => {
                list.value = response.data.items.slice(0, 8)
            })
        }

        fetchData()

        return {
            list,
            orderNoFilter,
            statusFilter,
        }
    },
})
</script>
