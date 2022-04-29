<template>
    <div class="dashboard-container">
        <component :is="currentRole" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'

export default defineComponent({
    name: "Dashboard",
    components: {
        AdminDashboard,
        EditorDashboard
    },
    setup() {
        const currentRole = ref('adminDashboard')

        const userStore = useUserStore()
        const { roles } = storeToRefs(userStore)

        if (!roles.value.includes('admin')) {
            currentRole.value = 'editorDashboard'
        }

        return {
            currentRole
        }
    }
})

</script>