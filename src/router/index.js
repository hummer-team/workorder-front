import Vue from 'vue'
import Router from 'vue-router'
import { RouterConf } from '@/config/'
import Main from '@/views/Main'
import ApiLogin from '@/views/ApiLogin'

// 首页模块
import mainIndex from '@/views/main/index'

const {workorderRoute} = require('./modules/workorder')

Vue.use(Router)


export default new Router({
  linkActiveClass: RouterConf.linkActiveClass,
  mode : RouterConf.mode,
  history: RouterConf.history,
  base : RouterConf.base,
  routes: [{
    path: '/',
    component: Main,
    children : [
      {path: '/', redirect: 'main/index'},
      {path: 'main/index', name: 'mainIndex', component: mainIndex}
    ].concat(
      workorderRoute,
    )
  }, {
    path: '/login',
    name: 'login',
    component: ApiLogin
  }, {
    path:'*',
    redirect: '/main/index'
  }]
})
