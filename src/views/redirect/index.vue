<script lang="ts">
import { defineComponent, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const { params, query } = useRoute()
        const { path } = params
        useRouter().replace({ path: '/' + path, query })

        return () => h("span")
    }
})
</script>
