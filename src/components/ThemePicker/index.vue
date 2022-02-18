<template>
    <div class="theme-picker-wrap">
        <el-color-picker
            ref="colorRef"
            v-model="theme"
            :predefine="['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']"
            class="theme-picker"
            popper-class="theme-picker-dropdown inside-right-panel"
            :append-to-body="false"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { CHANGE_EVENT } from '@/utils/constants'

const CHALK_STYLE = 'chalk-style'

export default defineComponent({
    name: "ThemePicker",
    emits: [CHANGE_EVENT],
    setup(_, { emit }) {
        const store = useStore()

        function tintColor(color: string, tint: number) {
            let red: string | number = parseInt(color.slice(0, 2), 16)
            let green: string | number = parseInt(color.slice(2, 4), 16)
            let blue: string | number = parseInt(color.slice(4, 6), 16)

            red += Math.round(tint * (255 - red))
            green += Math.round(tint * (255 - green))
            blue += Math.round(tint * (255 - blue))

            red = red.toString(16)
            green = green.toString(16)
            blue = blue.toString(16)

            return `#${red}${green}${blue}`
        }
        // 生成色带
        function getThemeCluster(theme: string) {
            const clusters: string[] = []
            clusters.push(`--el-color-primary: ${theme};`)

            let color = theme.replace('#', '')
            for (let i = 1; i <= 9; i++) {
                clusters.push(`--el-color-primary-light-${i}: ${tintColor(color, Number((i / 10).toFixed(2)))};`)
            }
            color = `:root {${clusters.join('')}}`

            return color
        }
        // 替换全局样式变量(element-plus 1.1.0-beta.1 之后使用var变量定义主题色)
        function switchTheme(theme: string) {
            const themeCluster = getThemeCluster(theme)

            let styleTag = document.getElementById(CHALK_STYLE)
            if (!styleTag) {
                styleTag = document.createElement('style')
                styleTag.setAttribute('id', CHALK_STYLE)
                document.head.appendChild(styleTag)
            }
            styleTag.innerText = themeCluster
        }

        const theme = computed({
            get: () => {
                return store.state.settings.theme
            },
            set: (theme) => {
                if (typeof theme !== 'string') return

                switchTheme(theme)
                emit(CHANGE_EVENT, theme)
            }
        })

        return {
            theme
        }
    },
})
</script>

<style>
.theme-message,
.theme-picker-dropdown {
    z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
}
</style>