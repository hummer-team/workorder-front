import Vue from 'vue'
import storage from '@/utils/storage'
import { menuData, menuDeep, getMenuParent } from '@/config/menu'

const state = {
  // 是否显示左侧菜单
  menuShow: true,
  // 是否显示面包屑
  breadShow: true,
  // 是否显示内页内容 - 刷新控制符 - 现在有 keep-alive 了，基本无效了
  isPageContentShow: true,
  // 需要刷新的page的name，基于 keep-alive 的 exclude 控制
  newPageName: '',
  // menutab里面需要展示loading图标的page的name，先于newPageName改变，避免UI刷新的不生效
  loadingPageName: '',
  // 数据字典
  parameter:{
    condition:[
      {code: 'gt', description: '大于'},
      {code: 'lt', description: '小于'},
      {code: 'eq', description: '等于'},
      {code: 'gte', description: '大于等于'},
      {code: 'lte', description: '小于等于'}
    ]
  }
}

const getters = {
  
}

const mutations = {
  setMenuShow (state, {menuShow}) {
    state.menuShow = menuShow
  },
  setBreadShow (state, {breadShow}) {
    state.breadShow = breadShow
  },
  setPageContentIsShow (state, {isShow}) {
    state.isPageContentShow = isShow
  },
  setNewPageName (state, {pageName}) {
    state.newPageName = pageName
  },
  setLoadingPageName (state, {pageName}) {
    state.loadingPageName = pageName
  }
}

const actions = {
  doMenuShow ({commit, state, dispatch}, {menuShow}) {
    commit('setMenuShow', {menuShow})
  },
  doBreadShow ({commit, state, dispatch}, {breadShow}) {
    commit('setBreadShow', {breadShow})
  },
  changePageContentIsShow ({commit, state, dispatch}, {isShow}) {
    commit('setPageContentIsShow', {isShow})
  },
  setNewPageName ({commit, state, dispatch}, {pageName}) {
    commit('setNewPageName', {pageName})
  },
  setLoadingPageName ({commit, state, dispatch}, {pageName}) {
    commit('setLoadingPageName', {pageName})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

