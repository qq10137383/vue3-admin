<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, onBeforeUnmount, onMounted, PropType } from 'vue'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { useResize } from '@/hooks/use-resize'

export interface LineDataType {
    expectedData: number[]
    actualData: number[]
}

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
            default: '350px'
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object as PropType<LineDataType>,
            required: true
        }
    },
    setup(props) {
        let chart: echarts.ECharts | null = null

        const elRef = ref<HTMLDivElement>()

        function setOptions({ expectedData, actualData } = {} as any) {
            if (!chart) return

            chart.setOption({
                xAxis: {
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    padding: [5, 10]
                },
                yAxis: {
                    axisTick: {
                        show: false
                    }
                },
                legend: {
                    data: ['expected', 'actual']
                },
                series: [{
                    name: 'expected', itemStyle: {
                        normal: {
                            color: '#FF005A',
                            lineStyle: {
                                color: '#FF005A',
                                width: 2
                            }
                        }
                    },
                    smooth: true,
                    type: 'line',
                    data: expectedData,
                    animationDuration: 2800,
                    animationEasing: 'cubicInOut'
                },
                {
                    name: 'actual',
                    smooth: true,
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#3888fa',
                            lineStyle: {
                                color: '#3888fa',
                                width: 2
                            },
                            areaStyle: {
                                color: '#f3f8ff'
                            }
                        }
                    },
                    data: actualData,
                    animationDuration: 2800,
                    animationEasing: 'quadraticOut'
                }]
            })
        }
        function initChart() {
            chart = echarts.init(elRef.value!, 'macarons')
            setOptions(props.chartData as any)
        }

        const resizeChart = ref(() => {
            chart && chart.resize()
        })
        useResize(resizeChart)

        watch(() => props.chartData, (val) => {
            setOptions(val)
        }, { deep: true })

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
