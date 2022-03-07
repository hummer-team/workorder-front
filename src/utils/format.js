/*
* format 主要放项目中的字符串format方法
*
*/

let format = {

  // 转换成日期显示
  date: function (val) {
    if (!val) return ''
    let date
    if (typeof (val) === 'string') {
      date = new Date(val)
    } else if (val instanceof Date) {
      date = val
    } else {
      return ''
    }
    return date.Format('yyyy-MM-dd')
  },

  // 转换成日期+时间显示
  datetime: function (val) {
    if (!val) return ''
    let date
    if (typeof (val) === 'string') {
      date = new Date(val)
    } else if (val instanceof Date) {
      date = val
    } else {
      return ''
    }
    return date.Format('yyyy-MM-dd hh:mm:ss')
  }
}

function hasFormat (type) {
  return format[type] || false
}

function getFormat (type, value) {
  return format[type] ? format[type](value) : ''
}

export default {
  format,
  hasFormat,
  getFormat
}
