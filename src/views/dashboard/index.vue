<template>
    <div>
        <bar-chart width="300px" height="300px" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import BarChart from "./admin/components/BarChart.vue"

export default defineComponent({
    name: "Dashboard",
    components: {
        BarChart
    }
})

</script>