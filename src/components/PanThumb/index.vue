<template>
    <div :style="{ zIndex: zIndex, height: height, width: width }" class="pan-item">
        <div class="pan-info">
            <div class="pan-info-roles-container">
                <slot />
            </div>
        </div>
        <!-- eslint-disable-next-line -->
        <div :style="{ backgroundImage: `url(${image})` }" class="pan-thumb"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "PanThumb",
    props: {
        image: {
            type: String,
            required: true
        },
        zIndex: {
            type: Number,
            default: 1
        },
        width: {
            type: String,
            default: '150px'
        },
        height: {
            type: String,
            default: '150px'
        }
    }
})
</script>
