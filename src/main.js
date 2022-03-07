import Vue from 'vue'
import 'es6-promise/auto' //兼容IE浏览器
import ElementUI from 'element-ui'
import './assets/css/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import App from './App'
import router from './router'
import store from './store' // 状态管理
// import i18n from './service/i18n'
import storage from './utils/storage'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$storage = storage

/** 注册全局组件 **/
import component from './library/component'
Vue.use(component)

/** 注册全局组件方法 **/
import componentFunc from './library/function'
Vue.use(componentFunc)

/** 注册全局过滤器 **/
import filter from './library/filter'
Vue.use(filter)

/** 注册全局指令 **/
import directive from './library/directive'
Vue.use(directive)

/** 引入API对象 **/
import api from './api'
Vue.prototype.$api = api

/** 引入校验对象 **/
import validator from './utils/validator'
Vue.prototype.$validator = validator

/** 引入格式化对象 **/
import format from './utils/format'
Vue.prototype.$format = format

/** 引入i18n对象 **/
// Vue.prototype.i18n = i18n

// 登录逻辑处理
import {menuOpen} from '@/utils/menu'

router.beforeEach(({meta, path, name}, from, next) => {
  //true用户已登录， false用户未登录
  let isLogin = Vue.isLogined()
  if (!isLogin && name !== 'login') {
    return next({ path: '/login' })
  }
  // if (isLogin && name === 'login') {
  //   return next({ path: '/' })
  // } 
  if( store.state.menu.menuTabSeled){
      let menuCode = store.state.menu.menuTabSeled.code
      if(menuCode !== name){
        menuOpen({name:name})
      }
    }
  next()
})
// 登录逻辑处理

new Vue({
  el: '#app',
  // i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
