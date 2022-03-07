/*
* validator 主要放项目中的字符串验证的方法
*
*/

let validator = {

  // 生成小程序跳转链接 1分钟-1年校验
  laterNow: function (val) {
    const setTime = new Date(val).getTime()
    const now = new Date().getTime()
    if (setTime < now + 1000*60 || setTime > now + 1000 * 60 * 60 * 24 * 365) {
      return { success: false, errorMsg: '仅支持选择大于当前时间1分钟到1年内的时间' }
    }
    return { success: true }
  },

  // 汉字校验
  isChinese: function (val) {
    let reg = /^[\u4E00-\u9FA5]+$/
    let errorMsg = '仅支持汉字'
    return {success: reg.test(val), errorMsg}
  },
  // 汉字英文校验
  isChineseOrEng: function (val) {
    // let reg = /^[\u0391-\uFFE5A-Za-z]+$/
    let reg = /^([a-zA-Z ]+|[\u4e00-\u9fa5]+)$/
    let errorMsg = '只可输入英文与空格或中文'
    return {success: reg.test(val), errorMsg}
  },
  // 汉字、英文、数字
  isNumOrEng: function (val) {
    let reg = /^([a-zA-Z0-9&]+)$/
    let errorMsg = '仅支持英文及数字'
    return {success: reg.test(val), errorMsg}
  },
  // 汉字、英文、数字
  isValidaChar: function (val) {
    // let reg = /^[\u0391-\uFFE5A-Za-z]+$/
    let reg = /^([a-zA-Z\u4E00-\u9FA50-9&]+)$/
    let errorMsg = '仅支持汉字、英文及数字'
    return {success: reg.test(val), errorMsg}
  },
  // 汉字、英文、数字、&校验
  isValidaCharWithAndSymbol: function (val) {
    let reg = /^([a-zA-Z\u4E00-\u9FA50-9&【】/、]+)$/
    let errorMsg = '仅支持汉字、英文、数字及（&、【】）号'
    return {success: reg.test(val), errorMsg}
  },

  // 数字校验
  isNumber: function (val) {
    let reg = /^[0-9]*$/
    let errorMsg = '仅支持数字'
    return {success: reg.test(val), errorMsg}
  },

  // 数字校验(包含正负)
  isAllNumber: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    return { success: true }
  },

  // >= 0
  isPositiveNumber: function (val) {
    let errorMsg = '仅支持0或正数'
    return {success: val >= 0, errorMsg}
  },

  // > 0
  isGtZero: function (val) {
    let errorMsg = '仅支持正数'
    return {success: val > 0, errorMsg}
  },

  // 0到1中间两位小数校验
  FromZeroToOne: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = 2
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val <= 0 || val >= 1 || dotlen > decimal) {
      return error('仅支持0到1之间的2位小数')
    } 
    return success()
  },

  // 大于等于0的两位小数校验
  isGtOrEqZeroDecimalTwo: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = 2
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val < 0 || dotlen > decimal) {
      return error('仅支持2位非负小数')
    } 
    return success()
  },

  // 大于0的两位小数校验
  isGtZeroDecimalTwo: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = 2
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val <= 0 || dotlen > decimal) {
      return error('仅支持2位正小数')
    } 
    return success()
  },

  // 大于等于2.5的两位小数校验
  isGtTwoPointFiveDecimalTwo: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = 2
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val < 2.5 || dotlen > decimal) {
      return error('仅支持大于等于2.5的两位小数')
    } 
    return success()
  },

  // 大于0的15位小数校验
  isGtZeroDecimal15: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = 15
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val <= 0 || dotlen > decimal) {
      return error('仅支持15位正小数')
    } 
    return success()
  },

  // 0到1中间小数校验
  FromZeroToOneNoLength: function (val) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (val < 0 || val > 1 ) {
      return error('仅支持小于 / 等于1的数字与小数')
    } 
    return success()
  },

  // 购物车等级校验
  cartLevel: function (val) {
    let reg = reg = /^([1-9][0-9]*|[0]{1,1})(\.[0-9]{1,2})?$/
    if (val.max !== '' && val.max !== undefined) {
      if (!(reg.test(val.max))) {return error('仅支持0或正数(最多保留两位小数)')}
    }
    if (val.min !== '' && val.min !== undefined) {
      if (!(reg.test(val.min))) {return error('仅支持0或正数(最多保留两位小数)')}
    }
    if (val.max !== '' && val.min !== '' && val.max !== undefined && val.min !== undefined) {
      if (Number(val.max) <= Number(val.min)) {
        return error('上限需大于下限')
      }
    }
    return success()
  },

  // 整数校验
  isInteger: function (val) {
    let reg = /(^-?\d+$)/
    let errorMsg = '仅支持整数'
    return {success: reg.test(val), errorMsg}
  },

  // 正整数校验
  isPNumber: function (val) {
    let reg = /(^[1-9]\d*$)/
    let errorMsg = '仅支持正整数'
    return {success: reg.test(val), errorMsg}
  },

  // 1-10000000正整数校验
  isWechatMerchantCouponNumber: function (val) {
    let reg = /(^[1-9]\d*$)/
    let errorMsg = '仅支持1-10000000正整数'
    return {success: reg.test(val) && val <= 10000000, errorMsg}
  },

  // 1-99正整数校验
  isDiscountNumber: function (val) {
    let reg = /(^[1-9]\d*$)/
    let errorMsg = '仅支持1-99正整数'
    return {success: reg.test(val) && val <= 99, errorMsg}
  },

  // 1-100正整数校验
  isScreenPerNumber: function (val) {
    let reg = /(^[1-9]\d*$)/
    let errorMsg = '仅支持1-100正整数'
    return {success: reg.test(val) && val <= 100, errorMsg}
  },
  
  isFNumber: function (val) {
    let reg = /^([1-9]\d*|[0]{1,1})$/
    let errorMsg = '仅支持0或正整数'
    return {success: reg.test(val), errorMsg}
  },

  isFFNumber: function (val) {
    let reg = /^[+]{0,1}(\d+)$/
    let errorMsg = '仅支持0或正整数'
    return {success: reg.test(val), errorMsg}
  },

  // 大于等于3小于等于8正整数
  between3To8: function (val) {
    let reg = /^([1-9]\d*|[0]{1,1})$/
    let errorMsg = '仅支持3-8的正整数'
    return {success: reg.test(val) && val >= 3 && val <= 8, errorMsg}
  },

  // 大于等于1小于等于8正整数
  isLt8: function (val) {
    let reg = /^([1-9]\d*|[0]{1,1})$/
    let errorMsg = '仅支持1-8的正整数'
    return {success: reg.test(val) && val >= 1 && val <= 8, errorMsg}
  },

  // 手机号校验
  isMobile: function (val) {
    let reg = /^[1][0-9]{10}$/
    let errorMsg = '手机号格式错误'
    return {success: reg.test(val), errorMsg}
  },

  // 邮箱校验
  isEmail: function (val) {
    let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    let errorMsg = '邮箱格式错误'
    return {success: reg.test(val), errorMsg}
  },

  // hex颜色格式校验
  colorHex: function (val) {
    let reg = /^#([a-fA-F\d]{6})$/
    let errorMsg = '颜色格式错误'
    return {success: reg.test(val), errorMsg}
  },

  // 包含特殊符号校验,如果有则报错
  withoutSpecialChar: function (val) {
    /* eslint-disable-next-line */
    let regEN = /[`~!@#$%^&*()_+<>?:\=\-"{},.\\\/;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    let errorMsg = '不能包含特殊字符'
    return {success: !(regEN.test(val) || regCn.test(val)), errorMsg}
  },

  // 包含WEB VIEW参数特殊符号校验,如果有则报错
  withoutWebViewSpecialChar: function (val) {
    let regEN = /[`~!@#$%^&*()+<>?:\=\-"{},.\\\/;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    let reg = /^[\u4E00-\u9FA5]+$/
    let errorMsg = '该参数名包含非法字符, 只支持英文大小写字母、数字及"_"'
    if (val instanceof Array) {
      let result = true
      val.forEach(item => {
        if (regEN.test(item) || regCn.test(item) || reg.test(item)) {
          result = false
          return
        }
      })
      
      return {success: result, errorMsg}
    } else {
      return {success: !(regEN.test(val) || regCn.test(val) || reg.test(val)), errorMsg}
    }
  },

  // 数字280到1280之间的整数
  isNumberSection: function (val) {
    let regEN = /(^[1-9]\d*$)/
    let errorMsg = '图片宽度需为280至1280之间的整数'
    return {success: (regEN.test(val) && val >= 280 && val <=1280), errorMsg}
  },

  // 字符串最大长度校验
  maxLength: function (val, config) {
    val = val + ''
    let length = parseInt(config.length)
    return {success: (val.length <= length), errorMsg: '长度不能超过' + length}
  },

  // 字符串最小长度校验
  minLength: function (val, config) {
    val = val + ''
    let length = parseInt(config.length)
    return {success: (val.length >= length), errorMsg: '长度不能小于' + length}
  },

  // 数字格式校验
  numberFormat: function (val) {
    let valString = val + ''
    let regFloat = /^(-?\d+)(\.\d+)?$/
    return regFloat.test(valString)
  },

  // 数字小数点后最大位数校验
  numberDecimal: function (val, config) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    let decimal = parseInt(config.decimal)
    let dotlen = val.toString().split('.').length === 1 ? 0 : val.toString().split('.')[1].length
    if (dotlen > decimal) {
      if (decimal === 0) {
        return error('仅支持整数')
      }
      return error('最大支持' + decimal + '位小数')
    }
    return success()
  },

  // 数字最小值校验
  minNumber: function (val, config) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    if (typeof (config.number) === 'function') {
      if (!config.number() && config.number() !== 0) {
        return success()
      }
    }
    val = parseFloat(val)
    let number = typeof (config.number) === 'function' ? parseFloat(config.number()) : parseFloat(config.number)
    let label = number
    return {success: (val >= number), errorMsg: '不能小于' + label}
  },

  // 数字最小值校验
  minThanNumber: function (val, config) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    if (typeof (config.number) === 'function') {
      if (!config.number() && config.number() !== 0) {
        return success()
      }
    }
    val = parseFloat(val)
    let number = typeof (config.number) === 'function' ? parseFloat(config.number()) : parseFloat(config.number)
    let label = number
    return {success: (val > number), errorMsg: '需大于' + label}
  },

  // 数字最大值校验
  maxNumber: function (val, config) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    if (typeof (config.number) === 'function') {
      if (!config.number() && config.number() !== 0) {
        return success()
      }
    }
    val = parseFloat(val)
    let number = typeof (config.number) === 'function' ? parseFloat(config.number()) : parseFloat(config.number)
    let label = number
    return {success: (val <= number), errorMsg: '不能大于' + label}
  },

  // 数字最大值校验
  maxThanNumber: function (val, config) {
    if (!validator.numberFormat(val)) {
      return error('数字格式错误')
    }
    if (typeof (config.number) === 'function') {
      if (!config.number() && config.number() !== 0) {
        return success()
      }
    }
    val = parseFloat(val)
    let number = typeof (config.number) === 'function' ? parseFloat(config.number()) : parseFloat(config.number)
    let label = number
    return {success: (val < number), errorMsg: '需小于' + label}
  },

  // 数字区间校验
  numberRange: function (val, config) {
    let {fieldList, fieldType, formData} = config
    let minNumber = parseFloat(formData[fieldList[0]])
    let maxNumber = parseFloat(formData[fieldList[1]])
    if (isNaN(minNumber) && isNaN(maxNumber)) {
      return success()
    }
    if (isNaN(minNumber) && fieldType === 'numberMin') {
      return error('请输入最小值')
    }
    if (isNaN(maxNumber) && fieldType === 'numberMax') {
      return error('请输入最大值')
    }
    if (maxNumber < minNumber) {
      return error('最大值不能小于最小值')
    }
    return success()
  },

  //tabbar标题字数校验, 4个汉字或8个字符
  tabbarTitle: function (val) {
    const reg = /[\u4e00-\u9fa5]/g
    let cnLength = 0
    if (val.match(reg)) {
      cnLength = val.match(reg).length
    }
    const enLength = val.length - cnLength
    if (cnLength * 2 + enLength > 8) {
      return error('至多支持4个汉字或8个字符')
    }
    return success()
  },

  // 用户登陆密码校验
  password: function (val) {
    if (val === 'Juran123456') {
      return error('不能设置成初始密码')
    }
    if (val.length < 8) {
      return error('密码长度不能小于8位')
    }
    if (val.length > 20) {
      return error('密码长度不能大于20位')
    }

    // 满足规则的数量
    let ruleTypeNumber = 0
    if (/[0-9]/.test(val)) ruleTypeNumber += 1
    if (/[a-z]/.test(val)) ruleTypeNumber += 1
    if (/[A-Z]/.test(val)) ruleTypeNumber += 1
    let withoutSpecial = validator.withoutSpecialChar(val)
    if (withoutSpecial.success === false) ruleTypeNumber += 1
    if (ruleTypeNumber < 3) {
      return error('需包含数字、大|小写字母、特殊符号中的三种')
    }

    return success()
  },

  // 身份证号验证 是否为18位编码，其中前17位必须为数字，第18位可为数字或大写X
  isIdCard: function (val) {
    let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    let errorMsg = '身份证格式错误'
    return {success: reg.test(val), errorMsg}
  },

  // 值集编码校验 只可输入大写英文字母、0-9及 “_”
  zhijiCode: function (val) {
    let reg = /^[0-9A-Z_]*$/
    let errorMsg = '仅可大写字母、数字、下划线'
    if (val.length > 50) {
      return error('长度不能超过50')
    }
    return {success: reg.test(val), errorMsg}
  },

  // 值编码校验 只可输入大写英文字母、0-9及 “_”
  zhiCode: function (val) {
    let reg = /^[0-9A-Z_]*$/
    let errorMsg = '仅可大写字母、数字、下划线'
    if (val.length > 30) {
      return error('长度不能超过30')
    }
    return {success: reg.test(val), errorMsg}
  },

  // 组织编码校验 只可输入大写英文字母、0-9及 “-”
  zuzhiCode: function (val) {
    let reg = /^[0-9A-Z-]*$/
    let errorMsg = '仅可大写字母、数字、中划线'
    return {success: reg.test(val), errorMsg}
  },

  // 施工资质号 只可以输入大写字母及数字
  sgZizhiCode: function (val) {
    let reg = /^[0-9A-Z]*$/
    let errorMsg = '仅可大写字母、数字'
    return {success: reg.test(val), errorMsg}
  },

  // 员工编码 只可以输入小写英文字母和数字
  employeeCode: function (val) {
    let reg = /^[0-9a-z]*$/
    let errorMsg = '仅可小写字母、数字'
    return {success: reg.test(val), errorMsg}
  },

  // 日历宜忌 只可以输入汉字和、
  advisableAndTaboo: function (val) {
    let reg = /^[\u4E00-\u9FA5、]+$/
    let errorMsg = '仅可文字和、'
    return {success: reg.test(val), errorMsg}
  },

  // 农历
  isLunarCalendar: function (val) {
    let reg = /^[一二三四五六七八九十腊正月初廿闰]+$/
    let errorMsg = '仅支持一二三四五六七八九十腊正月初廿闰'
    return {success: reg.test(val), errorMsg}
  },
  // 客户来源编码
  isPhone: function (val) {
    let reg = /^((0\d{2,3}\d{7,8})|(1[3584]\d{9}))$/
    // let reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
    let errorMsg = '仅可数字'
    return {success: reg.test(val), errorMsg}
  },
  // 工程项编码
  number: function (val) {
    let reg = /^[0-9]*$/
    let errorMsg = '仅可输入数字'
    return {success: reg.test(val), errorMsg}
  },
  // 最多输入10位整数2位小数
  isTenNumber: function (val) {
    let reg = /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{0,2})?$/
    let errorMsg = '最多输入10位整数2位小数'
    return {success: reg.test(val), errorMsg}
  },
  // 经度校验
  isLongitude: function (val) {
    let reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
    let errorMsg = '请输入正确的经度'
    return {success: reg.test(val), errorMsg}
  },
  // 纬度校验
  isLatitude: function (val) {
    let reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
    let errorMsg = '请输入正确的纬度'
    return {success: reg.test(val), errorMsg}
  },
  // 电话校验，包括移动电话和固定电话
  isPhoneNumber: function (val) {
    let regCell = /^[1][0-9]{10}$/
    let regTele= /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/
    let errorMsg = '电话格式错误'
    return {success: (regCell.test(val) || regTele.test(val)), errorMsg}
  },
  // 0和正整数并且int最大值2147483647
  isPNumberAndLessThanIntMax: function (val) {
    let reg = /^([1-9]\d*|[0]{1,1})$/
    let errorMsg = '最大支持2147483647'
    return {success: reg.test(val) && Number(val) <= 2147483647, errorMsg}
  },
  //URL 校验
  isURL: function (val) {
    let reg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/
    let errorMsg = 'URL格式错误'
    return {success: reg.test(val), errorMsg}
  },
  // WEB VIEW URL校验
  isWebViewURL: function (val) {
    let reg = /^(https?):\/\/[-A-Za-z0-9+/:.]+[-A-Za-z0-9/]$/
    let errorMsg = 'URL格式错误或包含非法字符, 只支持英文大小写字母、数字、":"、"/"及"-"'
    return {success: reg.test(val), errorMsg}
  },
  confirmPassword: function (val, config) {
    console.log('asdadasd', val, config)
    return {success: false, errorMsg}
  }
}

let result = function (success, errorMsg) {
  return {success, errorMsg}
}

let error = function (errorMsg) {
  return result(false, errorMsg)
}

let success = function () {
  return result(true, '')
}

// 输出适合 elementUI 表单校验的方法
let formRule = function (code, config) {
  config = config || {}
  return function (rule, value, callback) {
    if (value === '' || value === null || value === undefined) {
      if (code !== 'numberRange') callback()
    }
    let _Func = validator[code]
    let _ResObj = _Func(value, config)
    if (_ResObj.success) {
      callback()
    } else {
      callback(new Error(_ResObj.errorMsg))
    }
  }
}

export default {
  validator,
  formRule
}
