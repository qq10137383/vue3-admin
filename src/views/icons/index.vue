<template>
    <div class="icons-container">
        <aside>
            <a
                href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html"
                target="_blank"
            >Add and use</a>
        </aside>
        <el-tabs type="border-card">
            <el-tab-pane label="Icons">
                <div class="grid">
                    <div
                        v-for="item of svgIcons"
                        :key="item"
                        @click="handleClipboard(generateIconCode(item), $event)"
                    >
                        <el-tooltip placement="top">
                            <template v-slot:content>
                                <div>{{ generateIconCode(item) }}</div>
                            </template>
                            <div class="icon-item">
                                <svg-icon :icon-class="item" class-name="disabled" />
                                <span>{{ item }}</span>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Element-UI Icons">
                <div class="grid">
                    <div
                        v-for="item of elementIcons"
                        :key="item"
                        @click="handleClipboard(generateElementIconCode(item), $event)"
                    >
                        <el-tooltip placement="top">
                            <template v-slot:content>
                                <div>{{ generateElementIconCode(item) }}</div>
                            </template>
                            <div class="icon-item">
                                <el-icon class="disabled">
                                    <component :is="item" />
                                </el-icon>
                                <span>{{ item }}</span>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import clipboard from '@/utils/clipboard'
import * as iconComponents from '@element-plus/icons-vue'
import svgIcons from './svg-icons'

export default defineComponent({
    components: {
        ...iconComponents
    },
    setup() {
        function generateIconCode(symbol: string) {
            return `<svg-icon icon-class="${symbol}" />`
        }
        function generateElementIconCode(symbol: string) {
            return `<el-icon><${symbol} /></el-icon>`
        }
        function handleClipboard(text: string, event: MouseEvent) {
            clipboard(text, event)
        }

        return {
            elementIcons: Object.keys(iconComponents),
            svgIcons,
            generateIconCode,
            generateElementIconCode,
            handleClipboard
        }
    },
})
</script>


<style lang="scss" scoped>
.icons-container {
    margin: 10px 20px 0;
    overflow: hidden;

    .grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .icon-item {
        margin: 20px;
        height: 85px;
        text-align: center;
        width: 100px;
        float: left;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
    }

    span {
        display: block;
        font-size: 16px;
        margin-top: 10px;
    }

    .disabled {
        pointer-events: none;
    }
}
</style>

