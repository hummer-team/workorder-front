import API from '@/api'
import Vue from 'vue'
import storage from '@/utils/storage'
import router from '@/router'
import { Message } from 'element-ui'
import { clearCookie, flatten } from '@/utils/helper'
import { getAdssoLoginoutUrl } from '@/utils/business'

const state = {
  token: storage.get('token'),
  uid: storage.get('uid'),
  loginid: storage.get('loginid'),
  username: storage.get('username'),
  nickname: storage.get('nickname'),
  usertype: storage.get('usertype'),
  dictionary: storage.get('dictionary'),
  currentsiteId: localStorage.getItem('siteId'),
  loginErrorMsg: null,
  password: null,
  isLogining: null,
  menusTree: storage.get('menusTree'),
  currentTree: [],
  templates: storage.get('templates'),
  role: storage.get('role'),
  roleCode: storage.get('roleCode')
};

const getters = {
  brandSiteList (state) { // 用于站点树
    let treeList = state.menusTree
    // 若未设置默认站点 则第一个为默认站点
    // if (treeList && !treeList.some(item => item.siteRefData.default)) {
    //   treeList[0].siteRefData.default = true
    // }
    if (!treeList) return []
    return treeList.map(item => item.siteRefData)
  },
  currTreeList (state) { // 当前权限左侧栏树
    if (!state.menusTree) return []
    for (let i = 0 ; i < state.menusTree.length; i++) {
      if (state.currentsiteId === state.menusTree[i].siteRefData.siteId  ) {
        return state.menusTree[i].menuDatas
      }
    }
  },
  authortityFlatterList (state) {
     // 扁平化权限树list
    if (!state.menusTree) return []
    for (let i = 0 ; i < state.menusTree.length; i++) {
      if (state.currentsiteId === state.menusTree[i].siteRefData.siteId) {
        let authortityFlatterList = flatten(state.menusTree[i].menuDatas)
        localStorage.setItem('menusAuthorityList', JSON.stringify(authortityFlatterList))
        return authortityFlatterList
    }
  }
  }
}

const mutations = {
  setToken(state, token) {
    state.token = token
    storage.set('token', token)
  },
  setUsername(state, username) {
    state.username = username
    storage.set('username', username)
  },
  setNickname(state, nickname) {
    state.nickname = nickname
    storage.set('nickname', nickname)
  },
  setUsertype(state, usertype) {
    state.usertype = usertype
    storage.set('usertype', usertype)
  },
  setLoginid(state, loginid) {
    state.loginid = loginid
    storage.set('loginid', loginid)
  },
  setUid(state, uid) {
    state.uid = uid
    storage.set('uid', uid)
  },
  setPassword(state, password) {
    state.password = password
  },
  setIsLogining(state, isLogining) {
    state.isLogining = isLogining
  },
  setLoginErrorMsg(state, loginErrorMsg) {
    state.loginErrorMsg = loginErrorMsg
  },
  setDictionary(state, lists) {
    state.dictionary = lists
  },
  setMenusTree(state, tree) {
    state.tree = tree
  },
  setSiteList(state, list) {
    state.siteIds = list
  },
  setCurrMenusTree(state, data) {
    state.menusTree = data
  },
  setCurrentSite(state, site, commit) {
    state.currentsiteId = site

    localStorage.setItem('siteId', state.currentsiteId) // 每次commit时 更新本地存储siteID
    for (let i = 0 ; i < state.menusTree.length; i++) {
      if (state.currentsiteId === state.menusTree[i].siteRefData.siteId  ) {
        state.currentTree = state.menusTree[i].menuDatas
      }
    }
  },
  setTemplates(state, templates) {
    state.templates = templates
    storage.set('templates', templates)
  },
  setRole(state, role) {
    state.role = role
    storage.set('role', role)
  },
  setRoleCode(state, roleCode) {
    state.roleCode = roleCode
    storage.set('RoleCode', roleCode)
  }
}

const actions = {
  //登陆
  doLogin({commit, state, dispatch}, {that, username, password, type, code}) {
    if (state.isLogining) {
      commit('setLoginErrorMsg', '正在登陆，请勿重复提交')
      return;
    }

    let apiObj = API.workorder.login
    let data = {}

    data = {
      username: username,
      password: password
    }
    if (!username) {
      commit('setLoginErrorMsg', '请输入登陆账号')
      return;
    }
    if (!password) {
      commit('setLoginErrorMsg', '请输入登陆密码')
      return;
    }

    commit('setLoginErrorMsg', null)
    commit('setIsLogining', true)

    API.query(apiObj, { data, headers: { code } }).then(function ({res}) {
      console.log('at', res)
      if (res.code === 0) {
        // 请求dictionary
        dispatch('saveUserInfo', res.data).then(function () {
          router.push({ path: '/' })
        })
      } else {
        Message({
          message: res.message,
          type: 'warning',
          center: true,
          showClose: true,
          dangerouslyUseHTMLString: true
        })
        commit('setLoginErrorMsg', res.message)
      }
      commit('setIsLogining', false);
    }).catch(({response, message, request}) => {
      if (response && response.data) {
        commit('setLoginErrorMsg', JSON.stringify(response.data));
      } else {
        commit('setLoginErrorMsg', '异常错误，请重试');
      }
      commit('setIsLogining', false);
    });
  },
  //登出
  doLoginOut({commit}, that) {
    storage.clear()
    router.push({ name: 'login' })
  },
  setUsername({commit}, username) {
    commit('setUsername', username);
  },
  setPassword({commit}, password) {
    commit('setPassword', password);
  },
  saveUserInfo({commit}, data) {
    if (data.token) {
      commit('setToken', data.token)
    }
    if (data.username) {
      commit('setUsername', data.username)
    }
    if (data.nickName) {
      commit('setNickname', data.nickName)
    }
    if (data.userType) {
      commit('setUsertype', data.userType)
    }
    if (data.loginId) {
      commit('setLoginid', data.loginId)
    }
    if (data.uid) {
      commit('setUid', data.uid)
    }
    if (data.templates) {
      commit('setTemplates', data.templates)
    }
    if (data.role !== null && data.role !== undefined) {
      commit('setRole', data.role)
    }
    if (data.roleCode) {
      commit('setRoleCode', data.roleCode)
    }
  },
  clearUserInfo({commit}, data) {
    storage.clear()
  },
  saveMenusTree({commit}, data) {
    commit('setCurrMenusTree', data)
    storage.set('menusTree', (data))
  },
  //修改密码
  changePassword({commit, state, dispatch}, {that, data, loadTag}) {
    return API.query('User.ChangePassword', data, {that, loadTag}).then(function ({
      res
    }) {
      commit('setToken', res.sign)
    })
  },
  //获取列表数据
  getList({ commit, state, dispatch }, { data }) {
    return API.query(API.user.list, { params: data })
  },
  //获取列表数据
  getAddressList({ commit, state, dispatch }, { data }) {
    return API.query(API.user.list, { data: data })
  },
  //新建item
  createItem({ commit, state, dispatch }, { data }) {
    return API.query(API.user.save, { data: data })
  },
  //更新列表数据
  updateItem({ commit, state, dispatch }, { data }) {
    return API.query(API.user.update, { data: data })
  },
  deleteItem({ commit, state, dispatch }, { data }) {
    return API.query(API.user.delete, { params: data })
  },
  //省市区
  getRegion({ commit, state, dispatch }) {
    return API.query(API.user.region)
  },
  getCity({ commit, state, dispatch }, { data }) {
    return API.query(API.user.city, { params: data })
  },
  getDistrict({ commit, state, dispatch }, { data }) {
    return API.query(API.user.district, { params: data })
  },
  getMenusTreeandSiteIds({ commit, state, dispatch }, { data }) {
    return API.query(API.user.accountDetailById, { urlMerge: `/${data}` })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
