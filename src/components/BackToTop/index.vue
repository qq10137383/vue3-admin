<template>
    <transition :name="transitionName">
        <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
            <svg
                width="16"
                height="16"
                viewBox="0 0 17 17"
                xmlns="http://www.w3.org/2000/svg"
                class="Icon Icon--backToTopArrow"
                aria-hidden="true"
                style="height:16px;width:16px"
            >
                <path
                    d="M12.036 15.59a1 1 0 0 1-.997.995H5.032a.996.996 0 0 1-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z"
                />
            </svg>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, PropType, CSSProperties, ref, onMounted, onBeforeUnmount } from 'vue'

export default defineComponent({
    name: 'BackToTop',
    props: {
        visibilityHeight: {
            type: Number,
            default: 400
        },
        backPosition: {
            type: Number,
            default: 0
        },
        customStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => {
                return {
                    right: '50px',
                    bottom: '50px',
                    width: '40px',
                    height: '40px',
                    'border-radius': '4px',
                    'line-height': '45px',
                    background: '#e7eaf1'
                }
            }
        },
        transitionName: {
            type: String,
            default: 'fade'
        }
    },
    setup(props) {
        let interval: number | null = null
        let isMoving = false

        const visible = ref(false)

        function easeInOutQuad(t: number, b: number, c: number, d: number) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b
            return -c / 2 * (--t * (t - 2) - 1) + b
        }
        function backToTop() {
            if (isMoving) return
            const start = window.pageYOffset
            let i = 0
            isMoving = true
            interval = window.setInterval(() => {
                const next = Math.floor(easeInOutQuad(10 * i, start, -start, 500))
                if (next <= props.backPosition) {
                    window.scrollTo(0, props.backPosition)
                    clearInterval(interval!)
                    isMoving = false
                } else {
                    window.scrollTo(0, next)
                }
                i++
            }, 16.7)
        }
        function handleScroll() {
            visible.value = window.pageYOffset > props.visibilityHeight
        }

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
        })
        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
            if (interval) {
                window.clearInterval(interval)
            }
        })

        return {
            visible,
            backToTop
        }
    },
})
</script>

<style scoped>
.back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
}

.back-to-ceiling:hover {
    background: #d5dbe7;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.back-to-ceiling .Icon {
    fill: #9aaabf;
    background: none;
}
</style>
