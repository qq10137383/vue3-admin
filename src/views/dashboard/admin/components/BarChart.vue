<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { HtmlDivElementRef } from '@/utils/types'
import { useResize } from '@/hooks/use-resize'

const animationDuration = 6000

/**
 * Bar Chart
 */
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

        const elRef: HtmlDivElementRef = ref(null)

        const initChart = () => {
            chart = echarts.init(elRef.value!, 'macarons')
            chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 10,
                    left: '2%',
                    right: '2%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                }],
                series: [{
                    name: 'pageA',
                    type: 'bar',
                    stack: 'vistors',
                    // @types/echarts 定义有问题
                    barWidth: '60%' as any,
                    data: [79, 52, 200, 334, 390, 330, 220],
                    animationDuration
                }, {
                    name: 'pageB',
                    type: 'bar',
                    stack: 'vistors',
                    barWidth: '60%' as any,
                    data: [80, 52, 200, 334, 390, 330, 220],
                    animationDuration
                }, {
                    name: 'pageC',
                    type: 'bar',
                    stack: 'vistors',
                    barWidth: '60%' as any,
                    data: [30, 52, 200, 334, 390, 330, 220],
                    animationDuration
                }]
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

        return { elRef }
    },
})
</script>
