import Vue from 'vue'
import Vuex from 'vuex'

import menu from './modules/menu'
// 内容管理 - 界面配置区域状态管理
import common from './modules/common'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    slogan: '',
    historyLength: 0
  },
  mutations: {
    /*
     * @desc 记录路由切换次数
     * @arg {object} state 状态
     */
    updateHistoryLength (state) {
      state.historyLength++
    }
  },
  actions: {
    updateHistoryLength ({commit}) {
      commit('updateHistoryLength')
    }
  },
  modules: {
    menu,
    common,
    user
  }
})
