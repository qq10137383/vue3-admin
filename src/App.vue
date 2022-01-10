<template>
  <div id="app">
    <el-config-provider :size="size" :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useGetter } from '@/hooks/use-vuex'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  name: "App",
  setup() {
    const { size } = useGetter(['size'])

    const locale = ref(zhCn)

    return {
      size,
      locale
    }
  }
})
</script>

