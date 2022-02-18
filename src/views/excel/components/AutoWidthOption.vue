<template>
    <div style="display:inline-block;">
        <label class="radio-label">Cell Auto-Width:</label>
        <el-radio-group v-model="autoWidth">
            <el-radio :label="true" border>True</el-radio>
            <el-radio :label="false" border>False</el-radio>
        </el-radio-group>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { MODEL_EVENT } from '@/utils/constants'

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: true
        }
    },
    setup(props, { emit }) {
        const autoWidth = computed({
            get: () => {
                return props.modelValue
            },
            set: (val) => {
                emit(MODEL_EVENT, val)
            }
        })

        return {
            autoWidth
        }
    },
})
</script>
