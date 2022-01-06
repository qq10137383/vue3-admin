<template>
    <div>
        <div>1233434444</div>
        <el-input v-model="text" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const text = ref("")

        return {

            text
        }
    }
})
</script>
