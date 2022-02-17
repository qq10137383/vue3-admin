<template>
    <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ErrorTestB',
    setup() {
        // error code
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const b: any = b

        return {
            b
        }
    },
})
</script>
