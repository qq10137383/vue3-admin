<script lang="ts">
import { defineComponent, h } from 'vue'

/**
 * 重定向组件
 */
export default defineComponent({
    name: 'AuthRedirect',
    setup() {
        const hash = window.location.search.slice(1)
        if (window.localStorage) {
            window.localStorage.setItem('x-admin-oauth-code', hash)
            window.close()
        }

        return () => h("span")
    }
})
</script>
