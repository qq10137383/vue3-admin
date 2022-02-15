<template>
    <div class="components-container">
        <aside>When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner</aside>
        <aside>You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally</aside>
        <div class="placeholder-container">
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
            <div>placeholder</div>
        </div>
        <!-- you can add element-ui's tooltip -->
        <el-tooltip placement="top" content="tooltip">
            <back-to-top
                :custom-style="myBackToTopStyle"
                :visibility-height="300"
                :back-position="50"
                transition-name="fade"
            />
        </el-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import BackToTop from '@/components/BackToTop/index.vue'

export default defineComponent({
    name: 'BackToTopDemo',
    components: {
        BackToTop
    },
    setup() {
        // customizable button style, show/hide critical point, return position
        const myBackToTopStyle = reactive({
            right: '50px',
            bottom: '50px',
            width: '40px',
            height: '40px',
            'border-radius': '4px',
            'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
            background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        })

        return {
            myBackToTopStyle
        }
    },
})
</script>
