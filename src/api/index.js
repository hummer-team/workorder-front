/*
*  @ 接口配置主文件
*  @ 配置参数
*  url             接口路径
*  type            接口类型/模块
*  method          请求方法               默认 'post'
*  success         请求成功后默认触发succes提示信息
*  sendToken       请求带上token          默认 true
*  sendSiteId      请求带上siteId         默认 true
*  sendUserId      请求带上userId         默认 false
*/

// 接口访问方法
import { APIQuery } from './api'
import { ApiConf } from '@/config'

import workorder from './module/workorder'
import user from './module/user'
import template from './module/template'

let API = {
  query: APIQuery,
  workorder,
  template,
  user
}


export default API
 