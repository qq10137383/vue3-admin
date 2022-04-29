<template>
    <el-dropdown trigger="click" @command="handleSetSize">
        <div>
            <svg-icon class-name="size-icon" icon-class="size" />
        </div>
        <template v-slot:dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size === item.value"
                    :command="item.value">
                    {{ item.label }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAppStore, Size } from '@/store/modules/app'

export default defineComponent({
    name: "SizeSelect",
    setup() {
        const appStore = useAppStore()
        const { size } = storeToRefs(appStore)

        const sizeOptions = reactive([
            { label: 'Large', value: 'large' },
            { label: 'Default', value: 'default' },
            { label: 'Small', value: 'small' },
        ])

        function handleSetSize(value: string) {
            appStore.setSize(value as Size)
            ElMessage({
                message: 'Switch Size Success',
                type: 'success'
            })
        }

        return {
            sizeOptions,
            size,
            handleSetSize
        }
    }
})
</script>
