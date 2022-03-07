import storage from '@/utils/storage'
import { menuData } from '@/config/menu'

let indexMenu = menuData.find(v => v.isDefault)

const state = {
  menuDataList: [],
  menuTabList: [],
  menuTabSeled: null
}

const getters = {
  menuDataList (state) {
    if (!state.menuDataList || state.menuDataList.length === 0) {
      if (storage.has('menuDataList')) {
        state.menuDataList = storage.get('menuDataList')
      } else {
        state.menuDataList = menuData
      }
    }
    return state.menuDataList
  },
  menuTabList (state) {
    if (state.menuTabList.length === 0) {
      if (storage.has('menuTabList')) {
        state.menuTabList = storage.get('menuTabList')
      } else {
        state.menuTabList.push(indexMenu)
      }
    }
    return state.menuTabList
  },
  menuTabSeled (state) {
    if (!state.menuTabSeled) {
      if (storage.has('menuTabSeled')) {
        state.menuTabSeled = storage.get('menuTabSeled')
      } else {
        state.menuTabSeled = indexMenu
      }
    }
    return state.menuTabSeled
  }
}

const mutations = {
  setMenuData (state, data) {
    state.menuDataList = data
    state.menuTabList = []
    state.menuTabSeled = null
    storage.set('menuDataList', state.menuDataList)
    storage.remove('menuTabList')
    storage.remove('menuTabSeled')
  },
  setTabMenu (state, data) {
    state.menuTabSeled = data
    storage.set('menuTabSeled', state.menuTabSeled)
  },
  clearTabMenu (state) {
    state.menuTabSeled = null
    storage.remove('menuTabSeled')
  },
  setTabMenuList (state, data) {
    state.menuTabList = data
    storage.set('menuTabList', state.menuTabList)
  },
  // 清空菜单项
  clearTabMenuList (state, data) {
    state.menuTabList = []
    storage.remove('menuTabList')
  },
  // 关闭左/右侧的菜单项
  closeSideTabMenuList (state, data) {
    let menuTabList = []
    if (data === 'left') {
      menuTabList = state.menuTabList.filter(menu => menu.id >= state.menuTabSeled.id)
    } else if (data === 'right') {
      menuTabList = state.menuTabList.filter(menu => menu.id <= state.menuTabSeled.id)
    }
    menuTabList.forEach((menu, k) => {
      menu.id = k + 1
    })
    state.menuTabList = menuTabList
  },
  // 给页签列表重新配置id
  setMenuTabListId (state, data) {
    let selId = ''
    if (state.menuTabSeled) {
      selId = state.menuTabSeled
    }
    state.menuTabList.forEach((menu, k) => {
      if (selId === menu.id) {
        state.menuTabSeled.id = k + 1
      }
      menu.id = k + 1
    })
  },
  delTabMenu (state, data) {
    let code = data.code
    state.menuTabList = state.menuTabList.filter(v => v.code !== code)
    if (state.menuTabList.length === 0) {
      state.menuTabList.push(indexMenu)
    }
    if (state.menuTabSeled.code === data.code) {
      let menu = state.menuTabList[state.menuTabList.length - 1]
      menu.isNew = false
      state.menuTabSeled = menu
    }
    state.menuTabList.forEach((v, k) => {
      v.id = k + 1
    })

    storage.set('menuTabList', state.menuTabList)
    storage.set('menuTabSeled', state.menuTabSeled)
  },
  addTabMenu (state, data) {
    let has = state.menuTabList.find(v => v.code === data.code)
    if (has) {
      has.params = data.params
      has.query = data.query
      has.isNew = typeof (data.isNew) === 'boolean' ? data.isNew : true
      this.commit('menu/setTabMenu', has)
      return
    }
    let {code, name, url, params, query, isNew} = data
    let json = {code, name, url, params, query}
    json.id = state.menuTabList.length + 1
    json.isNew = typeof (isNew) === 'boolean' ? isNew : true
    state.menuTabList.push(json)
    this.commit('menu/setTabMenu', json)

    storage.set('menuTabList', state.menuTabList)
    storage.set('menuTabSeled', state.menuTabSeled)
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
