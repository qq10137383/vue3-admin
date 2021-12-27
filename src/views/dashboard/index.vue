<template>
    <div class="dashboard-container">
        <component :is="currentRole" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useGetter } from "@/hooks/use-vuex";
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

        const { roles } = useGetter(['roles'])

        if (!roles.value.includes('admin')) {
            currentRole.value = 'editorDashboard'
        }

        return {
            currentRole
        }
    }
})

</script>