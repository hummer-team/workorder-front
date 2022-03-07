/*
  business 主要放项目中的通用业务方法
*/
import storage from '@/utils/storage'
import { Message } from 'element-ui'


// 是否需要校验权限，返回 true 表示需要校验
const needCheckAuthority = function () {
  return true
}

// 检查menuCode是否有权限
const checkMenuCode = function (menuCode) {
  if (!menuCode) return true
  let userId = storage.get('userId')

  if (needCheckAuthority(userId)) {
    const menuList = storage.get('buttonDataList') || []
    if (menuList.indexOf(menuCode) >= 0) {
      return true
    }
    return false
  }
  return true
}

// 过滤对接接口的参数，不传空值
const filterEmptyFormData = function (formData = {}) {
  const data = {}
  Object.keys(formData).forEach(key => {
    if ((formData[key] || typeof (formData[key]) === 'boolean' || formData[key] === 0) && JSON.stringify(formData[key]) !== '[]') {
      data[key] = formData[key]
    }
  })
  return data
}

// 获取默认page对象
const getDefaultPageData = function (type = '') {
  const page = {
    layout: 'prev, pager, next, sizes, jumper',
    pageSize: 10,
    sizes: [10, 20, 50],
    pageNumber: 1,
    total: 0
  }
  if (type === 'dialog') {
    page.pageSize = 5
    page.sizes = [5, 10, 20]
  }
  return page
}

// 获取字典数据列表
const getDictionaryData = function (code) {
  let dictionary = storage.get("dictionary") || []
  return dictionary[code] || []
}

// 返回获取字典数据列表方法，主要给outbox配置文件使用
const getDictionaryDataFunc = function (code) {
  return () => getDictionaryData(code)
}

// 转换字典code为name
const getDictionaryName = function (code, value) {
  let dictionary = storage.get("dictionary") || []
  let dataList = dictionary[code] || []
  let dataObj = dataList.find(obj => obj.code === value)
  if (dataObj) {
    return dataObj.name
  }
  return ''
}

// 获取adsso登出跳转链接
const getAdssoLoginoutUrl = function () {
  let logoutUrl = 'https://login.partner.microsoftonline.cn/common/oauth2/v2.0/logout'
  let hostUrl = window.location.origin
  return logoutUrl + '?post_logout_redirect_uri=' + encodeURIComponent(hostUrl)
}

// 获取渠道列表
const getChannelEnum = function () {
  return []
}

// 获取站点列表
const getSiteEnum = function () {
  return [
    { name: '微软', code: 'microsoft', default: true}
  ]
}

export {
  needCheckAuthority,
  checkMenuCode,
  filterEmptyFormData,
  getDefaultPageData,
  getDictionaryData,
  getDictionaryDataFunc,
  getDictionaryName,
  getAdssoLoginoutUrl,
  getChannelEnum,
  getSiteEnum
}
