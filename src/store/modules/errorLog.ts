import { Module, MutationTree, ActionTree } from "vuex"
import { LogItem } from "@/utils/error-log"
import type { AllState } from '../index'

/**
 * ErrorLog State
 */
export type ErrorLogState = {
    logs: LogItem[]
}

const state: ErrorLogState = {
    logs: []
}

const mutations: MutationTree<ErrorLogState> = {
    ADD_ERROR_LOG(state, log: LogItem) {
        state.logs.push(log)
    },
    CLEAR_ERROR_LOG(state) {
        state.logs.splice(0)
    }
}

const actions: ActionTree<ErrorLogState, AllState> = {
    addErrorLog({ commit }, log: LogItem) {
        commit('ADD_ERROR_LOG', log)
    },
    clearErrorLog({ commit }) {
        commit('CLEAR_ERROR_LOG')
    }
}

/**
 * 错误日志模块
 */
const errorLog: Module<ErrorLogState, AllState> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default errorLog;