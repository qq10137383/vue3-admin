<template>
    <div>
        <div style="margin-bottom:15px;">Your roles: {{ roles }}</div>Switch roles:
        <el-radio-group v-model="switchRoles">
            <el-radio-button label="editor" />
            <el-radio-button label="admin" />
        </el-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useGetter } from '@/hooks/use-vuex'
import { CHANGE_EVENT } from '@/utils/constants'

export default defineComponent({
    emits: [CHANGE_EVENT],
    setup(_, { emit }) {
        const store = useStore()
        const { roles } = useGetter(['roles'])

        const switchRoles = computed({
            get() {
                return roles.value[0]
            },
            set(val: string) {
                store.dispatch('user/changeRoles', val).then(() => {
                    emit(CHANGE_EVENT)
                })
            }
        })

        return {
            roles,
            switchRoles
        }
    },
})
</script>
