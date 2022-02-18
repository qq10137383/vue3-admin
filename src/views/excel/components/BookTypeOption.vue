<template>
    <div style="display:inline-block;">
        <label class="radio-label">Book Type:</label>
        <el-select v-model="bookType" style="width:120px;">
            <el-option v-for="item in options" :key="item" :label="item" :value="item" />
        </el-select>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue'
import { MODEL_EVENT } from '@/utils/constants'

export type ExcelFormat = 'xlsx' | 'csv' | 'txt'

export default defineComponent({
    props: {
        modelValue: {
            type: String as PropType<ExcelFormat>,
            default: 'xlsx'
        }
    },
    setup(props, { emit }) {
        const options = ref<ExcelFormat[]>(['xlsx', 'csv', 'txt'])

        const bookType = computed({
            get: () => {
                return props.modelValue
            },
            set: (val) => {
                emit(MODEL_EVENT, val)
            }
        })

        return {
            options,
            bookType
        }
    },
})
</script>
