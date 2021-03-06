import { createStore } from 'vuex'

import type { AppState } from "./modules/app"
import app from "./modules/app"
import type { ErrorLogState } from "./modules/errorLog"
import errorLog from "./modules/errorLog"
import type { SettignsState } from "./modules/settings"
import settings from "./modules/settings"
import type { UserState } from "./modules/user"
import user from "./modules/user"
import type { PermissionState } from "./modules/permission"
import permission from "./modules/permission"
import type { TagsViewState } from "./modules/tagsView"
import tagsView from "./modules/tagsView"

import getters from './getters'

/**
 * state 模块定义
 */
export type AllState = {
  app: AppState,
  errorLog: ErrorLogState,
  settings: SettignsState,
  user: UserState,
  permission: PermissionState,
  tagsView: TagsViewState
}

export default createStore<AllState>({
  modules: {
    app,
    errorLog,
    settings,
    user,
    permission,
    tagsView
  },
  getters
})