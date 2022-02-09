<script lang="tsx">
import { defineComponent } from 'vue'

// 为了使其他步骤组件销毁预留的重置组件，窗口关闭时会切换到此组件
export default defineComponent({
    inheritAttrs: false,
    __stepIndex: 1,
    setup() {
        return () => <div />
    }
})

</script>