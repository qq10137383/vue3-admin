<template>
    <div style="display:inline-block;">
        <label class="radio-label" style="padding-left:0;">Filename:</label>
        <el-input
            v-model="filename"
            placeholder="Please enter the file name (default excel-list)"
            style="width:345px;"
            prefix-icon="el-icon-document"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: [MODEL_EVENT],
    setup(props, { emit }) {
        const filename = computed({
            get: () => {
                return props.modelValue
            },
            set: (val) => {
                emit(MODEL_EVENT, val)
            }
        })

        return {
            filename
        }
    },
})
</script>
