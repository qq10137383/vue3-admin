<template>
    <el-dialog
        :model-value="modelValue"
        :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
        :close-on-click-modal="false"
        top="30px"
        @close="cancel"
    >
        <el-form :model="role" label-width="80px" label-position="left">
            <el-form-item label="Name">
                <el-input v-model="editedRole.name" placeholder="Role Name" />
            </el-form-item>
            <el-form-item label="Desc">
                <el-input
                    v-model="editedRole.description"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="Role Description"
                />
            </el-form-item>
            <el-form-item label="Menus">
                <el-tree
                    ref="treeRef"
                    :check-strictly="checkStrictly"
                    :data="routes"
                    show-checkbox
                    node-key="path"
                    class="permission-tree"
                />
            </el-form-item>
        </el-form>
        <div style="text-align:right;">
            <el-button type="danger" @click="cancel">Cancel</el-button>
            <el-button type="primary" @click="confirmRole">Confirm</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick } from 'vue'
import { CustomRouteRecordRaw } from 'vue-router'
import { ElTree } from 'element-plus'
import path from 'path'
import { Role, getRoutes } from '@/api/role'
import { deepClone } from '@/utils'

interface RouteNode {
    path: string,
    label?: string,
    children?: RouteNode[]
}

const CONFIRM_EVENT = 'confirm'
const CANCEL_EVENT = 'update:modelValue'

const defaultRole: Role = {
    key: '',
    name: '',
    description: '',
    routes: []
}

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        dialogType: {
            type: String,
            default: 'new',
            validator: (val: string) => ['new', 'edit'].includes(val)
        },
        role: {
            type: Object as PropType<Partial<Role>>,
            default: () => ({})
        }
    },
    emits: [CONFIRM_EVENT, CANCEL_EVENT],
    setup(props, { emit }) {
        let serviceRoutes: CustomRouteRecordRaw[] = []

        const treeRef = ref<InstanceType<typeof ElTree>>()
        const checkStrictly = ref(false)
        const routes = ref<RouteNode[]>([])
        const editedRole = ref<Role>(Object.assign({}, defaultRole))

        function onlyOneShowingChild(children: CustomRouteRecordRaw[] = [], parent: CustomRouteRecordRaw) {
            let onlyOneChild: CustomRouteRecordRaw | null = null
            const showingChildren = children.filter(item => !item.hidden)

            // When there is only one child route, the child route is displayed by default
            if (showingChildren.length === 1) {
                onlyOneChild = showingChildren[0]
                onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
                return onlyOneChild
            }

            // Show parent if there are no child route to display
            if (showingChildren.length === 0) {
                onlyOneChild = { ...parent, path: '', noShowingChildren: true }
                return onlyOneChild
            }

            return false
        }
        function generateRoutes(routes: CustomRouteRecordRaw[], basePath = '/') {
            const res: RouteNode[] = []

            for (let route of routes) {
                // skip some route
                if (route.hidden) { continue }

                const showChild = onlyOneShowingChild(route.children, route)

                if (route.children && showChild && !route.alwaysShow) {
                    route = showChild
                }

                const data: RouteNode = {
                    path: path.resolve(basePath, route.path),
                    label: route.meta?.title
                }


                // recursive child routes
                if (route.children) {
                    data.children = generateRoutes(route.children, data.path)
                }
                res.push(data)
            }
            return res
        }
        function generateTree(routes: CustomRouteRecordRaw[], basePath = '/', checkedKeys: string[]) {
            const res: CustomRouteRecordRaw[] = []

            for (const route of routes) {
                const routePath = path.resolve(basePath, route.path)

                // recursive child routes
                if (route.children) {
                    route.children = generateTree(route.children, routePath, checkedKeys)
                }

                if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
                    res.push(route)
                }
            }
            return res
        }
        function generateArr(routes: RouteNode[]) {
            let data: RouteNode[] = []
            routes.forEach(route => {
                data.push(route)
                if (route.children) {
                    const temp = generateArr(route.children)
                    if (temp.length > 0) {
                        data = [...data, ...temp]
                    }
                }
            })
            return data
        }
        async function getRouteData() {
            const res = await getRoutes()
            serviceRoutes = res.data
            routes.value = generateRoutes(res.data)
        }
        function handleAddRole() {
            editedRole.value = Object.assign({}, defaultRole)
            if (treeRef.value) {
                treeRef.value.setCheckedNodes([], false)
            }
        }
        function handleEditRole() {
            const role = deepClone(props.role)
            editedRole.value = role
            checkStrictly.value = true
            nextTick(() => {
                const checkedRoutes = generateRoutes(role.routes)
                // el-tree setCheckedNodes类型定义有问题，全部是必须属性??
                treeRef.value!.setCheckedNodes(generateArr(checkedRoutes) as any, false)
                // set checked state of a node not affects its father and child nodes
                checkStrictly.value = false
            })
        }
        function confirmRole() {
            const checkedKeys = treeRef.value!.getCheckedKeys(false) as string[]
            editedRole.value!.routes = generateTree(deepClone(serviceRoutes), '/', checkedKeys)

            emit(CONFIRM_EVENT, editedRole.value)
        }
        function cancel() {
            emit(CANCEL_EVENT, false)
        }

        watch(() => props.modelValue, (val) => {
            if (!val) return

            if (props.dialogType == 'edit') {
                handleEditRole()
            }
            else {
                handleAddRole()
            }
        })

        getRouteData()

        return {
            treeRef,
            checkStrictly,
            routes,
            editedRole,
            confirmRole,
            cancel
        }
    },
})
</script>
