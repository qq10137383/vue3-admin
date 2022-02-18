<template>
    <div class="components-container">
        <aside>
            <a href="https://github.com/PanJiaChen/vue-countTo" target="_blank">countTo-component</a>
        </aside>
        <count-to
            ref="exampleRef"
            :start-val="startVal"
            :end-val="endVal"
            :duration="duration"
            :decimals="decimals"
            :separator="separator"
            :prefix="prefix"
            :suffix="suffix"
            :autoplay="false"
            class="example"
        />
        <div style="margin-left: 25%;margin-top: 40px;">
            <label class="label" for="startValInput">
                startVal:
                <input v-model.number="startVal" type="number" name="startValInput" />
            </label>
            <label class="label" for="endValInput">
                endVal:
                <input v-model.number="endVal" type="number" name="endVaInput" />
            </label>
            <label class="label" for="durationInput">
                duration:
                <input v-model.number="duration" type="number" name="durationInput" />
            </label>
            <div class="startBtn example-btn" @click="start">Start</div>
            <div class="pause-resume-btn example-btn" @click="pauseResume">pause/resume</div>
            <br />
            <label class="label" for="decimalsInput">
                decimals:
                <input v-model.number="decimals" type="number" name="decimalsInput" />
            </label>
            <label class="label" for="separatorInput">
                separator:
                <input v-model="separator" name="separatorInput" />
            </label>
            <label class="label" for="prefixInput">
                prefix:
                <input v-model="prefix" name="prefixInput" />
            </label>
            <label class="label" for="suffixInput">
                suffix:
                <input v-model="suffix" name="suffixInput" />
            </label>
        </div>
        <aside>
            &lt;count-to :start-val=&#x27;{{ startVal }}&#x27; :end-val=&#x27;{{ endVal }}&#x27; :duration=&#x27;{{ duration }}&#x27;
            :decimals=&#x27;{{ decimals }}&#x27; :separator=&#x27;{{ separator }}&#x27; :prefix=&#x27;{{ prefix }}&#x27; :suffix=&#x27;{{ suffix }}&#x27;
            :autoplay=false&gt;
        </aside>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue'
import { CountTo } from 'vue3-count-to'

export default defineComponent({
    name: 'CountToDemo',
    components: {
        CountTo: CountTo as any
    },
    setup() {
        const exampleRef = ref<InstanceType<typeof CountTo>>()
        const state = reactive({
            _setStartVal: 0,
            _setEndVal: 2017,
            _setDuration: 4000,
            _setDecimals: 0,
            _setSeparator: ',',
            _setSuffix: ' rmb',
            _setPrefix: '¥ '
        })

        const startVal = computed({
            get: () => {
                if (state._setStartVal) {
                    return state._setStartVal || 0
                } else {
                    return 0
                }
            },
            set: (val) => {
                state._setStartVal = val
            }
        })
        const endVal = computed({
            get: () => {
                if (state._setEndVal) {
                    return state._setEndVal
                } else {
                    return 0
                }
            },
            set: (val) => {
                state._setEndVal = val
            }
        })
        const duration = computed({
            get: () => {
                if (state._setDuration) {
                    return state._setDuration
                } else {
                    return 100
                }
            },
            set: (val) => {
                state._setDuration = val
            }
        })
        const decimals = computed({
            get: () => {
                if (state._setDecimals) {
                    if (state._setDecimals < 0 || state._setDecimals > 20) {
                        alert('digits argument must be between 0 and 20')
                        return 0
                    }
                    return state._setDecimals
                } else {
                    return 0
                }
            },
            set: (val) => {
                state._setDecimals = val
            }
        })
        const separator = computed(() => {
            return state._setSeparator
        })
        const suffix = computed(() => {
            return state._setSuffix
        })
        const prefix = computed(() => {
            return state._setPrefix
        })

        function start() {
            exampleRef.value?.start()
        }
        function pauseResume() {
            exampleRef.value?.pause()
        }

        return {
            exampleRef,
            startVal,
            endVal,
            duration,
            decimals,
            separator,
            suffix,
            prefix,
            start,
            pauseResume
        }
    },
})
</script>

<style scoped>
.example-btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 500;
    text-align: center;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    padding: 4px 15px;
    font-size: 12px;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
}

.example-btn:hover {
    color: #4ab7bd;
    background-color: #fff;
    border-color: #4ab7bd;
}
.example {
    font-size: 50px;
    color: #f6416c;
    display: block;
    margin: 10px 0;
    text-align: center;
    font-size: 80px;
    font-weight: 500;
}

.label {
    color: #2f4f4f;
    font-size: 16px;
    display: inline-block;
    margin: 15px 30px 15px 0;
}

input {
    position: relative;
    display: inline-block;
    padding: 4px 7px;
    width: 70px;
    height: 28px;
    cursor: text;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}

.startBtn {
    margin-left: 20px;
    font-size: 20px;
    color: #30b08f;
    background-color: #fff;
}

.startBtn:hover {
    background-color: #30b08f;
    color: #fff;
    border-color: #30b08f;
}

.pause-resume-btn {
    font-size: 20px;
    color: #e65d6e;
    background-color: #fff;
}

.pause-resume-btn:hover {
    background-color: #e65d6e;
    color: #fff;
    border-color: #e65d6e;
}
</style>