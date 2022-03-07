/*
  helper 主要放通用的工具方法
*/
import storage from '@/utils/storage'
import { Message, MessageBox } from 'element-ui'

// 提示信息
const showMessage = function (type, message, duration = 5000, showClose = true) {
  Message({
    message: message.substring(0, 200), duration, type, showClose
  })
}

const error = function (str) {
  showMessage('error', str, 5000)
}

const warning = function (str) {
  showMessage('warning', str, 5000)
}

const success = function (str) {
  showMessage('success', str, 3000)
}

const info = function (str) {
  showMessage('info', str, 3000)
}

// 检查api返回状态，异常则报错
const checkApiSuccess = function (res, isShowError = true) {
  if (res.code === 0) {
    return true
  } else {
    if (isShowError) {
      showMessage('error', res.message, 5000)
    }
  }
  return false
}

// 通用接口回调异常处理方法
const apiHandleError = function (error) {
  if (error.response) {
    console.log(error.response)
  } else {
    console.log(error)
  }
}

// 转义字符实体
const escapeHTML = function (a) {
  a = "" + a
  return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

// 转义字符实体
const unescapeHTML = function (a) {
  a = "" + a
  return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

// JSON拷贝
const jsonClone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 保留函数、对象原型拷贝
const objClone = function (obj) {
  let target
  if (typeof obj === 'object') {
    target = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] !== 'object') {
          target[key] = obj[key]
        } else {
          target[key] = objClone(obj[key])
        }
      }
    }
  } else {
    target = obj
  }
  return target
}

// 生成UUID方法
const getUUID = function () {
  const s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

// 复制内容到剪贴板
const copyText = function (txt) {
  const input = document.createElement('input')
  input.value = txt
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}

// 通用confirm方法封装
const confirm = function (param) {
  if (typeof (param) === 'string') {
    param = {title: param}
  }
  let {title, subTitle, confirmText, cancelText, cancelAndClose, type} = param

  title = title || '提示信息'
  subTitle = subTitle || '提示'
  cancelAndClose = cancelAndClose || false
  confirmText = confirmText || '确定'
  cancelText = cancelText || '取消'
  type = type || 'warning'

  return MessageBox.confirm(title, subTitle, {
    distinguishCancelAndClose: cancelAndClose,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type: type
  }).then().catch(err => { return err })
}

// 清空cookie
const clearCookie = function () {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--;)
    document.cookie = keys[i] + '=0;expires=' + new Date( 0).toUTCString()
  }
}

const flatten = function (arr) {
  var res = [];
  if (!arr) return []
  arr.map(item => {
      if(Array.isArray(item.child) && item.child) {
          res = res.concat(item).concat(flatten(item.child));
      } else {
          res.push(item);
      }
  });
  return res;
}

Date.prototype.Format = function (fmt) {
  var o = {
    // 月份
    'M+': this.getMonth() + 1,
    // 日
    'd+': this.getDate(),
    // 小时
    'h+': this.getHours(),
    // 分
    'm+': this.getMinutes(),
    // 秒
    's+': this.getSeconds(),
    // 季度
    'q+': Math.floor((this.getMonth() + 3) / 3),
    // 毫秒
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
  const get3MonthBefor = function (systemTime){
    var resultDate,year,month,date,hms;
    var currDate = new Date(systemTime);
    year = currDate.getFullYear();
    month = currDate.getMonth()+1;
    date = currDate.getDate();
    hms = (currDate.getHours() < 10 ? '0' + currDate.getHours() : currDate.getHours()) + ':' + (currDate.getMinutes() < 10 ? '0' + currDate.getMinutes() : currDate.getMinutes()) + ':' + (currDate.getSeconds() < 10 ? '0'+currDate.getSeconds() : currDate.getSeconds());
    switch(month)
    {
      case 1:
      case 2:
      case 3:
        month += 9;
        year--;
        break;
      default:
        month -= 3;
        break;
    }
    month = (month < 10) ? ('0' + month) : month;
    resultDate = year + '-'+month+'-'+date+' ' + hms;
    return resultDate;
}

export {
  error,
  warning,
  success,
  info,
  showMessage,
  checkApiSuccess,
  apiHandleError,
  escapeHTML,
  unescapeHTML,
  jsonClone,
  objClone,
  getUUID,
  copyText,
  confirm,
  clearCookie,
  flatten,
  get3MonthBefor
}
