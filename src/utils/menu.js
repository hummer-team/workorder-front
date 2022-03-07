/*
  menu 主要放页签处理方法
*/
// import storage from '@/utils/storage'
import Vue from 'vue'
import { menuData } from '@/config/menu'
import { error } from '@/utils/helper'
import store from '@/store'
import router from '@/router'

// 打开/跳转到tab页面，并传值
const menuOpen = function ({name, menu, params, query, isNew = true}) {
  if (name && typeof (name) === 'string') {
    menu = menuData.find(v => v.code === name) || ''
    if (name === 'login') {
      return
    }
    if (!menu) {
      error('无效的菜单code')
      return
    }
  }
  menu.params = params || {}
  menu.query = query || {}
  menu.isNew = isNew

  // 解决切换角色时，页面缓存没有实际清掉的BUG
  let menuTabList = store.getters['menu/menuTabList']
  if (!menuTabList.find(tab => tab.code === menu.code)) {
    menu.isNew = true
  }

  store.commit('menu/addTabMenu', menu)
}

// tab页面实际触发router方法
const menuTurn = function ({code, params = {}, query = {}, isNew = true}) {
  params = { ...params, isNew }
  let menuTabList = store.getters['menu/menuTabList']
  const menu = menuTabList.find(tab => tab.code === code)
  if (menu) {
    menu.params = params
    menu.query = query
  }
  router.push({name: code, params, query})
}

// 关闭tab页面
const menuClose = function ({name} = {}) {
  let menuList = store.getters['menu/menuTabList']
  let menu = {}
  if (name && typeof (name) === 'string') {
    menu = menuData.find(v => v.code === name) || ''
    if (!menu) {
      error('无效的菜单code')
      return
    }
  } else if (typeof (name) === 'undefined') {
    menu = store.getters['menu/menuTabSeled']
  } else {
    error('无效的菜单code类型')
    return
  }

  if (!menu.id) {
    menu = menuList.find(v => v.code === menu.code) || ''
    if (!menu) return
  }

  store.commit('menu/delTabMenu', menu)
}

// 刷新当前tab页面，并可以重新传值
const menuRefresh = function ({params, query} = {}) {
  let route = router.app.$route
  let menu = store.getters['menu/menuTabSeled']
  let name = menu.code

  // 获取页面文件配置的name
  if (route.matched && route.matched.length === 2) {
    let pageName = route.matched[1].components.default.name
    if (pageName !== name) {
      console.warn('页面文件 name【' + pageName + '】和配置的 menucode 【' + name + '】不匹配', '会造成刷新页面失效等问题')
    }
  }

  store.commit('setLoadingPageName', {pageName: name})

  setTimeout(() => {
    store.commit('setNewPageName', {pageName: name})

    // 相同的 query 直接跳转会报错，所以不考虑仅 params 变化的情况
    if (query && JSON.stringify(route.query) !== JSON.stringify(query)) {
      router.push({ name, params, query})
    }
  }, 50)
}

export {
  menuOpen,
  menuTurn,
  menuClose,
  menuRefresh
}
