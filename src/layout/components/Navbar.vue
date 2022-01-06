<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <search id="header-search" class="right-menu-item" />

                <error-log class="errLog-container right-menu-item hover-effect" />

                <screenfull id="screenfull" class="right-menu-item hover-effect" />

                <el-tooltip content="Global Size" :effect="Effect.DARK" placement="bottom">
                    <size-select
                        id="size-select"
                        class="size-select-container right-menu-item hover-effect"
                    />
                </el-tooltip>
            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <el-icon class="el-icon-caret-bottom">
                        <caret-bottom />
                    </el-icon>
                </div>
                <template v-slot:dropdown>
                    <el-dropdown-menu>
                        <router-link to="/profile/index">
                            <el-dropdown-item>Profile</el-dropdown-item>
                        </router-link>
                        <router-link to="/">
                            <el-dropdown-item>Dashboard</el-dropdown-item>
                        </router-link>
                        <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
                            <el-dropdown-item>Github</el-dropdown-item>
                        </a>
                        <a
                            target="_blank"
                            href="https://panjiachen.github.io/vue-element-admin-site/#/"
                        >
                            <el-dropdown-item>Docs</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided @click="logout">
                            <span style="display:block;">Log Out</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { Effect } from 'element-plus'
import { CaretBottom } from '@element-plus/icons-vue'
import { useGetter } from '@/hooks/use-vuex'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import Search from '@/components/HeaderSearch/index.vue'

export default defineComponent({
    name: 'Navbar',
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
        Screenfull,
        SizeSelect,
        Search,
        CaretBottom
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const { sidebar, avatar, device } = useGetter(['sidebar', 'avatar', 'device'])

        function toggleSideBar() {
            store.dispatch('app/toggleSideBar')
        }
        async function logout() {
            await store.dispatch('user/logout')
            router.push(`/login?redirect=${route.fullPath}`)
        }

        return {
            sidebar,
            avatar,
            device,
            Effect,
            toggleSideBar,
            logout
        }
    }
})
</script>


<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .size-select-container {
        ::v-deep(div[class^="el-dropdown--"]) {
            height: 100%;
            display: flex;
            align-items: center;
        }
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
