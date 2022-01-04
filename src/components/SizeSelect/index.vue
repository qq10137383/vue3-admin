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
import { defineComponent, reactive, nextTick, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGetter } from '@/hooks/use-vuex'

export default defineComponent({
    name: "SizeSelect",
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { size } = useGetter(['size'])

        const sizeOptions = reactive([
            { label: 'Default', value: 'default' },
            { label: 'Medium', value: 'medium' },
            { label: 'Small', value: 'small' },
            { label: 'Mini', value: 'mini' }
        ])

        const instance = getCurrentInstance()

        function refreshView() {
            // In order to make the cached page re-rendered
            store.dispatch('tagsView/delAllCachedViews', route)

            const { fullPath } = route

            nextTick(() => {
                router.replace({
                    path: '/redirect' + fullPath
                })
            })
        }
        // 设置size属性到Element-plus的全局设置(app.config.globalProperties.$ELEMENT)
        // 下面两种写法都可以，和app.config.globalProperties.$ELEMENT是一个变量
        //  1、instance.proxy.$ELEMENT
        //  2、instance?.appContext.config.globalProperties.$ELEMENT
        // 要获得类型提示需要在typings/vue-runtime-ext.d.ts中定义$ELEMENT类型
        function setElementSize(value: any) {
            const publicInstance = instance!.proxy!;
            (publicInstance.$ELEMENT || (publicInstance.$ELEMENT = {})).size = value
        }
        function handleSetSize(value: string) {
            setElementSize(value)
            store.dispatch('app/setSize', value)
            refreshView()
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
