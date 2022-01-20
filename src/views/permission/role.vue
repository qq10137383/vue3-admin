<template>
    <div class="app-container">
        <el-button type="primary" @click="handleAddRole">New Role</el-button>

        <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
            <el-table-column align="center" label="Role Key" width="220">
                <template v-slot="scope">{{ scope.row.key }}</template>
            </el-table-column>
            <el-table-column align="center" label="Role Name" width="220">
                <template v-slot="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="header-center" label="Description">
                <template v-slot="scope">{{ scope.row.description }}</template>
            </el-table-column>
            <el-table-column align="center" label="Operations">
                <template v-slot="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <role-form
            v-model="dialogVisible"
            :dialog-type="dialogType"
            :role="editedRole"
            @confirm="confirmRole"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { TableColumnScope } from '@/utils/types'
import { Role, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import RoleForm from './components/RoleForm.vue'

export default defineComponent({
    components: {
        RoleForm
    },
    setup() {
        const rolesList = ref<Role[]>([])
        const editedRole = ref<Partial<Role>>({})
        const dialogVisible = ref(false)
        const dialogType = ref('new')

        function handleAddRole() {
            dialogType.value = 'new'
            dialogVisible.value = true
        }
        function handleEdit(scope: TableColumnScope<Role>) {
            dialogType.value = 'edit'
            dialogVisible.value = true
            editedRole.value = scope.row
        }
        function handleDelete({ $index, row }: TableColumnScope<Role>) {
            ElMessageBox.confirm('Confirm to remove the role?', 'Warning', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            })
                .then(async () => {
                    await deleteRole(row.key)
                    rolesList.value.splice($index, 1)
                    ElMessage({
                        type: 'success',
                        message: 'Delete succed!'
                    })
                })
                .catch(err => { console.error(err) })
        }
        async function confirmRole(role: Role) {
            const isEdit = dialogType.value === 'edit'
            const items = rolesList.value
            if (isEdit) {
                await updateRole(role.key, role)
                for (let index = 0; index < items.length; index++) {
                    if (items[index].key === role.key) {
                        items.splice(index, 1, Object.assign({}, role))
                        break
                    }
                }
            } else {
                const { data } = await addRole(role)
                role.key = data.key
                items.push(role)
            }

            const { description, key, name } = role
            dialogVisible.value = false
            ElNotification({
                title: 'Success',
                dangerouslyUseHTMLString: true,
                message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
                type: 'success'
            })
        }
        async function getRoleData() {
            const res = await getRoles()
            rolesList.value = res.data
        }

        getRoleData()

        return {
            rolesList,
            editedRole,
            dialogVisible,
            dialogType,
            handleAddRole,
            handleEdit,
            handleDelete,
            confirmRole
        }
    },
})
</script>


<style lang="scss" scoped>
.app-container {
    .roles-table {
        margin-top: 30px;
    }
    .permission-tree {
        margin-bottom: 30px;
    }
}
</style>
