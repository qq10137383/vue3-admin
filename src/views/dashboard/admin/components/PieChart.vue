<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { useResize } from '@/hooks/use-resize'

export default defineComponent({
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        }
    },
    setup() {
        let chart: echarts.ECharts | null = null

        const elRef = ref<HTMLDivElement | null>(null)

        function initChart() {
            chart = echarts.init(elRef.value!, 'macarons')
            chart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    bottom: '10',
                    data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
                },
                series: [
                    {
                        name: 'WEEKLY WRITE ARTICLES',
                        type: 'pie',
                        roseType: 'radius',
                        radius: [15, 95],
                        center: ['50%', '38%'],
                        data: [
                            { value: 320, name: 'Industries' },
                            { value: 240, name: 'Technology' },
                            { value: 149, name: 'Forex' },
                            { value: 100, name: 'Gold' },
                            { value: 59, name: 'Forecasts' }
                        ],
                        animationEasing: 'cubicInOut',
                        animationDuration: 2600
                    }
                ]
            })
        }

        const resizeChart = ref(() => {
            chart && chart.resize()
        })
        useResize(resizeChart)

        onMounted(() => nextTick(initChart))
        onBeforeUnmount(() => {
            chart && chart.dispose()
            chart = null
        })

        return {
            elRef
        }
    }
})

</script>
