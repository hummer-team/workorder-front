import {
  Message
} from 'element-ui'
import storage from '@/utils/storage'
import {
  error,
  warning,
  success,
  info,
  showMessage,
  checkApiSuccess,
  apiHandleError,
  jsonClone,
  objClone,
  getUUID,
  confirm
} from '@/utils/helper'
import {
  filterEmptyFormData,
  getDefaultPageData,
  getDictionaryData,
  getDictionaryName,
  getChannelEnum,
  getSiteEnum
} from '@/utils/business'
import {
  menuOpen,
  menuTurn,
  menuClose,
  menuRefresh
} from '@/utils/menu'

export default {
  install(Vue, options) {
    // 页面跳转
    Vue.prototype.pageTurn = function (url = '') {
      if (typeof(url) === 'string') {
        this.$router.push({
          path: url
        })
      } else if (typeof(url) === 'object') {
        this.$router.push(url)
      }
    }

    // 返回上一页
    Vue.prototype.backPage = function () {
      this.$router.go(-1)
    }

    // 打开/跳转到tab页面，并传值
    Vue.prototype.menuOpen = menuOpen
    
    // tab页面实际触发router方法
    Vue.prototype.menuTurn = menuTurn

    // 关闭tab页面
    Vue.prototype.menuClose = menuClose

    // 刷新当前tab页面，并传值
    Vue.prototype.menuRefresh = menuRefresh

    // 判断是否登陆
    Vue.isLogined = function () {
      if (storage.get('token')) {
        return true
      }
      return false
    }

    // 判断是否验证
    Vue.prototype.isAuthority = function () {
      if (localStorage.getItem('authority')) {
        return true
      }
      return false
    }

    // 获取时间戳
    Vue.prototype.getTimeStamp = function (str) {
      if (!str) return 0
      if (typeof (str) === 'string') {
        return (new Date(str)).getTime()
      }
      return 0
    }

    // JSON拷贝
    Vue.prototype.jsonClone = jsonClone

    // object拷贝
    Vue.prototype.objClone = objClone

    // 生成UUID方法
    Vue.prototype.getUUID = getUUID

    // 通用confirm方法封装
    Vue.prototype.confirm = confirm

    // 过滤对接接口的参数，不传空值
    Vue.prototype.filterEmptyFormData = filterEmptyFormData

    // 判断是否空对象
    Vue.prototype.isEmptyObj = function (obj) {
      if (Object.getOwnPropertySymbols(obj).length) {
        return false
      }
      if (Object.getOwnPropertyNames(obj).length) {
        return false
      }
      return true
    }

    // 判断是否是布尔值
    Vue.prototype.isBoolean = function (obj) {
      return (typeof (obj) === 'boolean')
    }

    // 判断是否是字符串
    Vue.prototype.isString = function (obj) {
      return (typeof (obj) === 'string')
    }

    // 判断是否是函数
    Vue.prototype.isFunction = function (obj) {
      return (typeof (obj) === 'function')
    }

    // 判断是否数组对象
    Vue.prototype.isArray = function (obj) {
      return obj instanceof Array
    }

    // 判断是否Date对象
    Vue.prototype.isDate = function (obj) {
      return obj instanceof Date
    }

    // 判断变量是否定义
    Vue.prototype.isSet = function (obj) {
      return (typeof (obj) !== 'undefined')
    }

    Vue.prototype.error = error

    Vue.prototype.warning = warning

    Vue.prototype.success = success

    Vue.prototype.info = info

    // 获取渠道列表
    Vue.prototype.getChannelEnum = function () {
      return getDictionaryData('ChannelEnum')
    }

    // 获取站点列表
    Vue.prototype.getSiteEnum = getSiteEnum

    // 通用API返回校验方法
    Vue.prototype.checkApiSuccess = checkApiSuccess

    // 通用API错误处理方法
    Vue.prototype.apiHandleError = apiHandleError

    // 通用重置表单方法
    Vue.prototype.resetForm = function (ref) {
      let form = this.$refs[ref]
      if (form) {
        form.resetFields()
      }
    }

    // 通用打开弹出框方法
    Vue.prototype.openDialog = function (ref, data = '') {
      let dialog = this.$refs[ref]
      if (dialog) {
        dialog.$emit('openDialog', data)
      }
    }

    // 通用关闭弹出框方法
    Vue.prototype.closeDialog = function (ref, data = '') {
      let dialog = this.$refs[ref]
      if (dialog) {
        dialog.$emit('closeDialog', data)
      }
    }

    // 获取默认page对象
    Vue.prototype.getDefaultPageData = getDefaultPageData

    // 获取字典数据列表
    Vue.prototype.getDictionaryData = getDictionaryData

    // 转换字典code为name
    Vue.prototype.getDictionaryName = getDictionaryName

    // 设置字段对应组件
    Vue.prototype.setItemComponentName = function (item, row = {}) {
      let type = item.type
      if (typeof (item.type) === 'function') {
        type = item.type(row)
      }
      if (type === 'text') {
        item.componentName = 'default-text'
      } else if (type === 'button') {
        item.componentName = 'default-button'
      } else if (type === 'input') {
        item.componentName = 'default-input'
      } else if (type === 'input-number') {
        item.componentName = 'default-input-number'
      } else if (type === 'select') {
        item.componentName = 'default-select'
      } else if (type === 'switch') {
        item.componentName = 'default-switch'
      } else if (type === 'checkbox') {
        item.componentName = 'default-checkbox'
      } else if (type === 'checkbox-list') {
        item.componentName = 'default-checkbox-list'
      } else if (type === 'radio-list') {
        item.componentName = 'default-radio-list'
      } else if (type === 'date-picker') {
        item.componentName = 'default-date-picker'
      } else if (type === 'outbox') {
        item.componentName = 'default-outbox'
      } else if (type === 'image') {
        item.componentName = 'default-image'
      } else if (type === 'image-list') {
        item.componentName = 'default-image-list'
      } else if (type === 'editor') {
        item.componentName = 'default-editor'
      } else if (type === 'cascader') {
        item.componentName = 'default-cascader'
      } else if (type === 'slider') {
        item.componentName = 'default-slider'
      } else if (type === 'wechat-upload') {
        item.componentName = 'wechat-upload'
      } else if (type === 'time-picker') {
        item.componentName = 'default-time-picker'
      } else if (type === 'product-select') {
        item.componentName = 'default-product-select'
      } else if (type === 'hot-area-image') {
        item.componentName = 'hot-area-image'
      } else if (type === 'switch-image') {
        item.componentName = 'default-switch-image'
      } else if (type === 'cms-multi-live-select') {
        item.componentName = 'cms-multi-live-select'
      } else if (type === 'toolbar') {
        item.componentName = 'toolbar'
      } else if (type === 'form-table') {
        item.componentName = 'default-form-table'
      } else if (type === 'simple-editor') {
        item.componentName = 'default-simple-editor'
      } else if (type === 'rich-text') {
        item.componentName = 'default-rich-text'
      } else if (type === 'tooltip') {
        item.componentName = 'default-tooltip'
      } else if (type === 'table-text') {
        item.componentName = 'default-table-text'
      }
    }

    // 设置字段默认
    Vue.prototype.setItemDefaultSize = function (item) {
      if (!item.size) {
        if (item.type === 'checkbox-list' || item.type === 'radio-list') {
          item.span = 24
        } else if (item.type === 'input' && item.rows > 1 ) {
          item.span = 24
        } else if (item.type === 'editor') {
          item.span = 24
        } else if (item.type === 'image-list') {
          item.span = 24
        } else {
          item.size = 1
        }
      }
    }

    // 设置字段对应默认值
    Vue.prototype.getItemDefaultData = function (item) {
      let data = ''
      if (typeof (item.defaultValue) !== 'undefined') {
        data = item.defaultValue
      }
      if (item.type === 'input-number') {
        data = 0
      } else if (item.type === 'switch') {
        data = this.isSet(item.inactiveValue) ? item.inactiveValue : false
      } else if (item.type === 'checkbox') {
        data = this.isSet(item.falseLabel) ? item.falseLabel : false
      } else if (item.type === 'checkbox-list') {
        data = []
      } else if (item.type === 'select' && item.multiple === true) {
        data = []
      } else if (item.type === 'outbox' && item.multiple === true) {
        data = []
      } else if (item.type === 'image-list') {
        data = []
      }
      return data
    }

    Vue.prototype.$getQuery = function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r !== null) return (r[2]); return null
    }

    // 格式化简单富文本
    Vue.prototype.formatSimpleContent = function (content) {
      let data = content
      if (data) {
        data = data.replaceAll('</div><div>', '<br>')
        data = data.replaceAll('</div>', '')
        data = data.replaceAll('<div>', '<br>')
      }
      return data
    }
  }
}
