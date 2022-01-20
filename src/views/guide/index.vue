<template>
    <div class="app-container">
        <aside>
            The guide page is useful for some people who entered the project for the first time. You can briefly introduce the
            features of the project. Demo is based on
            <a
                href="https://github.com/kamranahmedse/driver.js"
                target="_blank"
            >driver.js.</a>
        </aside>
        <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">Show Guide</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default defineComponent({
    name: 'Guide',
    setup() {
        const driver = new Driver({
            padding: 0
        })

        function guide() {
            driver.defineSteps(steps)
            driver.start()
        }

        return {
            guide
        }
    },
})
</script>
