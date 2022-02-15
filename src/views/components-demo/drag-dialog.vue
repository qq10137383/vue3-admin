<template>
    <div class="components-container">
        <aside>
            vue3 does not support the use of custom directives on components such as 'Fragement' (multi-root)、'Teleport' etc,
            because 'el-dialog' is wrapped by the 'teleport' component, so the 'el-drag-dialog' directive is invalid, 
            instead use the new built-in 'dragggable' property of 'el-dialog'
        </aside>
        <aside>for example: &lt;el-dialog title="Shipping address" draggable&gt;&lt;/el-dialog&gt;</aside>
        <el-button type="primary" @click="dialogTableVisible = true">open a Drag Dialog</el-button>
        <el-dialog v-model="dialogTableVisible" title="Shipping address" draggable>
            <el-select ref="selectRef" v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
            <el-table :data="gridData">
                <el-table-column property="date" label="Date" width="150" />
                <el-table-column property="name" label="Name" width="200" />
                <el-table-column property="address" label="Address" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElSelect } from 'element-plus'

export default defineComponent({
    name: 'DragDialogDemo',
    setup() {
        const selectRef = ref<InstanceType<typeof ElSelect>>()
        const dialogTableVisible = ref(false)
        const options = ref([
            { value: '选项1', label: '黄金糕' },
            { value: '选项2', label: '双皮奶' },
            { value: '选项3', label: '蚵仔煎' },
            { value: '选项4', label: '龙须面' }
        ])
        const value = ref('')
        const gridData = ref([{
            date: '2016-05-02',
            name: 'John Smith',
            address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
            date: '2016-05-04',
            name: 'John Smith',
            address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
            date: '2016-05-01',
            name: 'John Smith',
            address: 'No.1518,  Jinshajiang Road, Putuo District'
        }, {
            date: '2016-05-03',
            name: 'John Smith',
            address: 'No.1518,  Jinshajiang Road, Putuo District'
        }])

        // v-el-drag-dialog onDrag callback function
        function handleDrag() {
            selectRef.value?.blur()
        }

        return {
            selectRef,
            dialogTableVisible,
            options,
            value,
            gridData,
            handleDrag
        }
    },
})
</script>
