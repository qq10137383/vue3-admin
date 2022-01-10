<template>
    <el-color-picker
        v-model="theme"
        :predefine="['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
    />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useGetter } from '@/hooks/use-vuex'
import pkg from 'element-plus/package.json'

const ORIGINAL_THEME = '#409EFF' // default color
const CHANGE_EVENT = 'change'

export default defineComponent({
    name: "ThemePicker",
    emits: [CHANGE_EVENT],
    setup(_, { emit }) {
        let chalkStyle: string

        const { theme } = useGetter(['theme'])

        function tintColor(color: string, tint: number) {
            let red: string | number = parseInt(color.slice(0, 2), 16)
            let green: string | number = parseInt(color.slice(2, 4), 16)
            let blue: string | number = parseInt(color.slice(4, 6), 16)

            if (tint === 0) { // when primary color is in its rgb space
                return [red, green, blue].join(',')
            } else {
                red += Math.round(tint * (255 - red))
                green += Math.round(tint * (255 - green))
                blue += Math.round(tint * (255 - blue))

                red = red.toString(16)
                green = green.toString(16)
                blue = blue.toString(16)

                return `#${red}${green}${blue}`
            }
        }
        function shadeColor(color: string, shade: number) {
            let red: string | number = parseInt(color.slice(0, 2), 16)
            let green: string | number = parseInt(color.slice(2, 4), 16)
            let blue: string | number = parseInt(color.slice(4, 6), 16)

            red = Math.round((1 - shade) * red)
            green = Math.round((1 - shade) * green)
            blue = Math.round((1 - shade) * blue)

            red = red.toString(16)
            green = green.toString(16)
            blue = blue.toString(16)

            return `#${red}${green}${blue}`
        }
        function getThemeCluster(theme: string) {
            const clusters = [theme]
            for (let i = 0; i <= 9; i++) {
                clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
            }
            clusters.push(shadeColor(theme, 0.1))
            return clusters
        }
        function getCSSString(url: string): Promise<string> {
            return new Promise(resolve => {
                const xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        chalkStyle = xhr.responseText.replace(/@font-face{[^}]+}/, '')
                        resolve(chalkStyle)
                    }
                }
                xhr.open('GET', url)
                xhr.send()
            })
        }
        function updateStyle(style: string, oldCluster: string[], newCluster: string[]) {
            let newStyle = style
            oldCluster.forEach((color, index) => {
                newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
            })
            return newStyle
        }
        async function switchTheme(val: string) {
            const oldVal = chalkStyle ? theme.value : ORIGINAL_THEME
            if (typeof val !== 'string') return
            const themeCluster = getThemeCluster(val.replace('#', ''))
            const originalCluster = getThemeCluster(oldVal.replace('#', ''))

            const $message = ElMessage({
                message: '  Compiling the theme',
                customClass: 'theme-message',
                type: 'success',
                duration: 0,
                icon: 'el-icon-loading'
            })

            const getHandler = (id: string) => {
                return () => {
                    const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
                    const newStyle = updateStyle(chalkStyle, originalCluster, themeCluster)

                    let styleTag = document.getElementById(id)
                    if (!styleTag) {
                        styleTag = document.createElement('style')
                        styleTag.setAttribute('id', id)
                        document.head.appendChild(styleTag)
                    }
                    styleTag.innerText = newStyle
                }
            }

            if (!chalkStyle) {
                const url = `https://unpkg.com/${pkg.name}@${pkg.version}/${pkg.style}`
                await getCSSString(url)
            }

            const chalkHandler = getHandler('chalk-style')

            chalkHandler()

            const styles = ([].slice.call(document.querySelectorAll('style')) as HTMLStyleElement[])
                .filter(style => {
                    const text = style.innerText
                    return new RegExp(oldVal, 'i').test(text) && !/Element Chalk Variables/.test(text)
                })
            styles.forEach(style => {
                const { innerText } = style
                if (typeof innerText !== 'string') return
                style.innerText = updateStyle(innerText, originalCluster, themeCluster)
            })

            emit(CHANGE_EVENT, val)

            $message.close()
        }

        watch(theme, switchTheme)

        return {
            theme
        }
    },
})
</script>
