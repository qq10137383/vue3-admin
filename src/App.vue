<template>
  <div id="app">
    <el-config-provider :size="size">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useGetter } from '@/hooks/use-vuex'

export default defineComponent({
  name: "App",
  setup() {
    const { size } = useGetter(['size'])
    
    return {
      size
    }
  }
})
</script>

