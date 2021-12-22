import { createStore } from 'vuex'
import type { AppState } from "./modules/app"
import app from "./modules/app"
import type { ErrorLogState } from "./modules/errorLog"
import errorLog from "./modules/errorLog"
import type { SettignsState } from "./modules/settings"
import settings from "./modules/settings"
import type { UserState } from "./modules/user"
import user from "./modules/user"

export type AllState = {
  app: AppState,
  errorLog: ErrorLogState,
  settings: SettignsState,
  user: UserState
}

export default createStore<AllState>({
  modules: {
    app,
    errorLog,
    settings,
    user
  },
  getters: {},
  plugins: []
})