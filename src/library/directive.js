/*
* directive 配置全局自定义指令
*
*/

// import { checkMenuCode } from '@/utils/helper'

export default{
  install (Vue, options) {
    Vue.directive('check', {
      inserted: function (el, binding, vnode) {
        // if (!checkMenuCode(binding.value)) {
        //  el.parentNode.removeChild(el)
        // }
      }
    })
  }
}
