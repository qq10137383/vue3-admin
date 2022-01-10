<template>
    <el-dropdown trigger="click" @command="handleSetSize">
        <div>
            <svg-icon class-name="size-icon" icon-class="size" />
        </div>
        <template v-slot:dropdown>
            <el-dropdown-menu>
                <el-dropdown-item
                    v-for="item of sizeOptions"
                    :key="item.value"
                    :disabled="size === item.value"
                    :command="item.value"
                >
                    {{
                        item.label
                    }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useGetter } from '@/hooks/use-vuex'

export default defineComponent({
    name: "SizeSelect",
    setup() {
        const store = useStore()
        const { size } = useGetter(['size'])

        const sizeOptions = reactive([
            { label: 'Large', value: 'large' },
            { label: 'Default', value: 'default' },
            { label: 'Small', value: 'small' },
        ])

        async function handleSetSize(value: string) {
            await store.dispatch('app/setSize', value)
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
