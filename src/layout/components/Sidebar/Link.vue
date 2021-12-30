<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot></slot>
    </component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { isExternal } from '@/utils/validate'

type LinkProps = Pick<HTMLLinkElement, 'href' | 'target' | 'rel'>
type RouterLinkProps = InstanceType<typeof RouterLink>["$props"]

export default defineComponent({
    props: {
        to: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const external = computed(() => isExternal(props.to))
        const type = computed(() => external.value ? 'a' : 'router-link')

        function linkProps(to: string): LinkProps | RouterLinkProps {
            if (external.value) {
                return {
                    href: to,
                    target: '_blank',
                    rel: 'noopener'
                }
            }
            return {
                to: to
            }
        }

        return {
            external,
            type,
            linkProps
        }
    },
})
</script>
