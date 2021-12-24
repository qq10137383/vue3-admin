import { Module, MutationTree, ActionTree } from "vuex"
import { RouteRecordRaw } from "vue-router"
import { login, logout, getInfo, LoginDto, UserVo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import type { AllState } from "../index"

export type UserState = {
    token: string,
    name: string,
    avatar: string,
    introduction: string,
    roles: string[]
}

const state: UserState = {
    token: getToken() ?? "",
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations: MutationTree<UserState> = {
    SET_TOKEN(state, token: string) {
        state.token = token
    },
    SET_INTRODUCTION(state, introduction: string) {
        state.introduction = introduction
    },
    SET_NAME(state, name: string) {
        state.name = name
    },
    SET_AVATAR(state, avatar: string) {
        state.avatar = avatar
    },
    SET_ROLES(state, roles: string[]) {
        state.roles = roles
    }
}

const actions: ActionTree<UserState, AllState> = {
    // user login
    login({ commit }, userInfo: LoginDto): Promise<string> {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { data } = response
                debugger
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve(data.token)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }): Promise<UserVo> {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response

                if (!data) {
                    reject('Verification failed, please Login again.')
                }

                const { roles, name, avatar, introduction } = data

                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }

                commit('SET_ROLES', roles)
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, dispatch }): Promise<boolean> {
        return new Promise((resolve, reject) => {
            logout().then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()

                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, { root: true })

                resolve(true)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }): Promise<boolean> {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve(true)
        })
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role: string) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)

        const { roles } = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
        // dynamically add accessible routes
        accessRoutes.forEach((r: RouteRecordRaw) => router.addRoute(r));

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })
    }
}

const user: Module<UserState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default user
