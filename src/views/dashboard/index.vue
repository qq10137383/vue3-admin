<template>
    <div>
        <bar-chart width="300px" height="300px" />
        <panel-group />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import BarChart from "./admin/components/BarChart.vue"
import PanelGroup from "./admin/components/PanelGroup.vue"

export default defineComponent({
    name: "Dashboard",
    components: {
        BarChart,
        PanelGroup
    }
})

</script>