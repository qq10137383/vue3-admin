<template>
    <div>
        <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

export default defineComponent({
    name: "Screenfull",
    setup() {
        const isFullscreen = ref(false)

        function click() {
            // screenfull的类型定义可能为false，使用类型守卫判断一下
            if (!screenfull || !screenfull.enabled) {
                ElMessage({
                    message: 'you browser can not work',
                    type: 'warning'
                })
                return false
            }
            screenfull.toggle()
        }
        function change() {
            isFullscreen.value = screenfull && screenfull.isFullscreen
        }

        onMounted(() => {
            if (screenfull && screenfull.enabled) {
                screenfull.on('change', change)
            }
        })
        onBeforeUnmount(() => {
            if (screenfull && screenfull.enabled) {
                screenfull.off('change', change)
            }
        })

        return {
            isFullscreen,
            click
        }
    },
})
</script>

<style scoped>
.screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
}
</style>