<template>
    <div>
        <div>1233434444</div>
        <el-input v-model="text" />
        <el-button type="primary">测试</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: "Profile",
    setup() {
        const text = ref("")

        return {
            text
        }
    }
})
</script>
