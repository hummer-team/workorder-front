/*
 *  @ 接口调用方法配置
 */
import axios from 'axios'
import { MessageBox } from 'element-ui'
import { showMessage, checkApiSuccess } from '@/utils/helper'
import { ApiConf } from '@/config'
import storage from '@/utils/storage'

axios.defaults.baseURL = ApiConf.base + ApiConf.url
axios.defaults.timeout = ApiConf.timeout
axios.defaults.withCredentials = true

function APIQuery (api, conf = {}) {
  if (!api || !api.url) {
    showMessage('error', '不合规的api对象')
    return
  }

  api = setApiObj(api)

  // 请求路径
  let url = getUrl(api, conf)

  // 请求方法
  let method = conf.method || api.method

  // 请求头
  let headers = getHeaders(api, conf)

  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Credentials'] = true

  if (url === '/v1/backoffice/secure/aad' || url === '/v1/backoffice/sign_out') {
    headers['Accept'] = '*/*'
  }

  // 请求主体被发送的数据 只适用于 'PUT', 'POST', 和 'PATCH'
  let data = getDatas(api, conf)

  // URL 参数
  let params = getParams(api, conf)

  // 接口超时时间 毫秒
  let timeout = conf.timeout || ApiConf.timeout

  // 服务器响应的数据类型
  let responseType = conf.responseType || 'json'

  let axiosConf = {
    url,
    method,
    headers,
    data,
    params,
    timeout,
    xhrFields: {
      withCredentials: true
    },
    withCredentials: true
  }

  let AXIOS = axios.create(axiosConf)

  // 添加请求拦截器
  AXIOS.interceptors.request.use(function (config) {
    // 处理请求数据

    return config
  }, function (error) {
    // 处理请求错误

    return Promise.reject(error)
  });

  // 添加响应拦截器
  AXIOS.interceptors.response.use(function (response) {
    // 处理响应数据
    const { data } = response
    if (url !== '/v1/backoffice/secure/aad' && url !== '/v1/backoffice/sign_out') {
      if (data.serializableData && !data.data) {
        data.data = data.serializableData
      }
      if (!data.data) {
        data.data = {}
      }
  
      if (api.success && checkApiSuccess(data, false)) {
        showMessage('success', api.success, 3000)
      }
    }
    response.res = data
    return response
  }, function (err) {
    // 处理响应错误 {config,response,message,request}

    if (err.response) {
      let response = err.response
      if (response.status === 500 && response.data.errors && Array.isArray(response.data.errors)) {
        // error('接口异常:' + response.data.errors.join(','))
      } else if (isTokenInvalid(response)) {
        MessageBox.alert('当前的账号长时间没有操作，为了您的系统及账号安全请成重新登录', '登录过期', {
          showClose: false,
          confirmButtonText: '重新登录',
          callback: action => {
            storage.set('token', '')
            window.location.href = '/'
          }
        })
      } else if (isInterfaceAuthrity(response)) {
        MessageBox.alert('请联系管理员以获得访问权限，我们对给您带来不便深表歉意', '无接口权限', {
          // showClose: false,
          // confirmButtonText: '重新登录',
          // callback: action => {
          //   storage.set('token', '')
          //   window.location.href = '/'
          // }
        })
      }else {
        showMessage('error', '(' + response.status + ') ' + response.data.message)
      }
    } else {
      showMessage('error', '网络异常')
    }

    return Promise.reject(err)
  })
  return AXIOS.request()
}

// 判断token是否失效
function isTokenInvalid (response) {
  if (response.status === 401) return true
  return false
}

// 判断是否有接口权限
function isInterfaceAuthrity(response) {
  if (response.status === 403) return true
  return false
}

// 配置api对象默认值
function setApiObj (api) {
  let defaultData = {
    method: 'post',
    sendToken: true,
    sendSiteId: true,
    sendUserId: false
  }

  return {
    ...defaultData,
    ...api
  }
}

function getUrl (api, conf) {
  let url = api.url
  // 如果是真实地址，则不处理，直接返回
  if (url.indexOf('http') === 0) return url
  // 如果是auth的地址，则不处理，直接返回
  if (url.indexOf(ApiConf.auth) === 0) return url
  // 如果第一个字符是/，则干掉
  if (url.indexOf('/') === 0) {
    url = url.substr(1)
  }

  if (conf.urlMerge) {
    url += conf.urlMerge
  }

  // 根据接口的type加上对应的url头
  switch (api.type) {
    case 'udtReform' :
      // url = ApiConf.api + ApiConf.version + ApiConf.contentPath + url
      url = ApiConf.api + '/' + url
      break
    case 'base':
      url = ApiConf.api + '/baseservice/' + url
      break
    case 'admin':
      url = ApiConf.api + '/adminservice/' + url
      break
    case 'linkpage':
      url = ApiConf.api + '/wcmsservice/' + url
      break
    case 'product':
      url = ApiConf.api + '/productservice/' + url
      break
    case 'promotion':
      url = ApiConf.api + '/promotionservice/' + url
      break
    case 'operatorlog':
      url = ApiConf.api + '/operatorlogservice/' + url
      break
    case 'productv2':
      url = ApiConf.api + '/productservicev2/' + url
      break
    case 'file':
      url = ApiConf.api + '/filestoreservice/' + url
      break
    case 'order':
      url = ApiConf.api + '/orderservice/' + url
      break
  }

  return url
}

function getDatas (api, conf) {
  let obj = {}
  if (conf.data) {
    obj = {...conf.data}
    if (conf.page) {
      const { pageNumber, pageSize } = conf.page
      obj.pageNumber = pageNumber
      obj.pageSize = pageSize
    }
  }
  return obj
}

function getParams (api, conf) {
  let obj = {}
  if (conf.params) {
    obj = {...conf.params}
    if (conf.page) {
      const { pageNumber, pageSize } = conf.page
      obj.pageNumber = pageNumber
      obj.pageSize = pageSize
    }
  }
  return obj
}

function getHeaders (api, conf) {
  // 用户唯一凭证
  let token = conf.token || storage.get('token')
  // 分站点参数
  let siteId = conf.siteId || localStorage.getItem('siteId')
  if (conf.siteId === null) {
    siteId = null
  }
  // 用户Id 某些接口需要加？
  let userId = conf.userId || storage.get('userId')
  // 请求headers
  let headers = conf.headers || {}
  headers['X-Request-Time'] = new Date().getTime()
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (token && api.sendToken) {
    headers.token = token
  }

  if (siteId && api.sendSiteId) {
    headers.siteId = siteId
  }

  if (userId && api.sendUserId) {
    headers.userid = userId
  }

  if (conf.channelCode) {
    headers.channelCode = conf.channelCode
  }

  return headers
}

export {
  APIQuery
}
