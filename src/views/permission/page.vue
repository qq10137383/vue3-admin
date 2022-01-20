<template>
    <div class="app-container">
        <switch-roles @change="handleRolesChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import SwitchRoles from './components/SwitchRoles.vue'

export default defineComponent({
    name: 'PagePermission',
    components: {
        SwitchRoles
    },
    setup() {
        const router = useRouter();

        function handleRolesChange() {
            router.push({ path: '/permission/index?' + new Date().getTime() })

        }

        return {
            handleRolesChange
        }
    },
})
</script>
