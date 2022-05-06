import { reactive, toRefs } from 'vue'
import { defineStore } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { loginApi, logoutApi, getInfoApi, LoginDto, UserVo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tagsView'

/**
 * 用户模块
 */
export const useUserStore = defineStore('user', () => {
    // state
    const state = reactive({
        token: getToken() ?? "",
        name: '',
        avatar: '',
        introduction: '',
        roles: [] as string[]
    })

    // actions
    // user login
    function login(userInfo: LoginDto): Promise<string> {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            loginApi({ username: username.trim(), password: password })
                .then(response => {
                    const { data } = response
                    state.token = data.token
                    setToken(data.token)
                    resolve(data.token)
                }).catch(error => {
                    reject(error)
                })
        })
    }
    // get user info
    function getInfo(): Promise<UserVo> {
        return new Promise((resolve, reject) => {
            getInfoApi(state.token).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const { roles, name, avatar, introduction } = data

                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                state.roles = roles
                state.name = name
                state.avatar = avatar
                state.introduction = introduction
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
    // user logout
    function logout(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            logoutApi().then(() => {
                state.token = ''
                state.roles = []
                removeToken()
                resetRouter()

                const permission = usePermissionStore()
                permission.setRoutes([])

                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                const tagsView = useTagsViewStore()
                tagsView.delAllViews()

                resolve(true)
            }).catch(error => {
                reject(error)
            })
        })
    }
    // remove token
    function resetToken(): Promise<boolean> {
        return new Promise(resolve => {
            state.token = ''
            state.roles = []
            removeToken()
            resolve(true)
        })
    }
    // dynamically modify permissions
    async function changeRoles(role: string) {
        const token = role + '-token'

        state.token = token
        setToken(token)

        const { roles } = await getInfo()

        resetRouter()

        // generate accessible routes map based on roles
        const permission = usePermissionStore()
        const accessRoutes = await permission.generateRoutes(roles)
        // dynamically add accessible routes
        accessRoutes.forEach((r: RouteRecordRaw) => router.addRoute(r as RouteRecordRaw));

        // reset visited views and cached views
        const tagsView = useTagsViewStore()
        tagsView.delAllViews()
    }


    return {
        ...toRefs(state),
        login,
        getInfo,
        logout,
        resetToken,
        changeRoles
    }
})