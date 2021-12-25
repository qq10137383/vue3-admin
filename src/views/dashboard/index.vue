<template>
    <div>
        <bar-chart width="300px" height="300px" />
        <panel-group />
        <box-card />
        <transaction-table />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import BarChart from "./admin/components/BarChart.vue"
import PanelGroup from "./admin/components/PanelGroup.vue"
import BoxCard from "./admin/components/BoxCard.vue"
import TransactionTable from "./admin/components/TransactionTable.vue"

export default defineComponent({
    name: "Dashboard",
    components: {
        BarChart,
        PanelGroup,
        BoxCard,
        TransactionTable
    }
})

</script>