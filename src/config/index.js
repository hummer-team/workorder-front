/**
 * 配置文件
 *
 */

// 路由全局配置
let RouterConf = {
  linkActiveClass: 'active',
  mode: 'hash',
  history: false,
  base: '/'
}

// 接口全局配置
let ApiConf = {
  base: 'http://10.171.38.50:20000/',
  base: '/',
  url: '',
  api: '/api',
  timeout: 30000
}

// 渠道code配置
let channelCode = {
  wmall: 'BROS',
  wxMini: 'WXMP'
}

// 文件管理对应的API url
let ImgConf = {
  baseurl: 'https://storeapp-admin-api.test.microsoftstore.com.cn/',
  serviceurl: '/filestoreservice/'
}

// 站点全局配置
let WebsiteConf = {
	webname: '微软业务中台',
  copyright: 'Copyright © 2018 埃森哲数字化部门所有'
}

// 开发环境
if (process.env.NODE_ENV === 'development') {

}

// 生产环境
if (process.env.NODE_ENV === 'production') {
  ApiConf.base = 'https://storeapp-admin-api.test.microsoftstore.com.cn/'
  ApiConf.api = ''
}

// 测试环境
if (process.env.NODE_ENV === 'testing') {
  ApiConf.base = 'https://storeapp-admin-api.test.microsoftstore.com.cn/'
  ApiConf.api = ''
}

export {
  RouterConf,
  ApiConf,
  channelCode,
  ImgConf,
  WebsiteConf
}
