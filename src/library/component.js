/*
*  @ 全局通用组件注册文件
*  @
*/

// 基础组件 basic
import defaultDialog from '@/components/basic/default-dialog.vue'
import defaultValidate from '@/components/basic/default-validate.vue'
import defaultText from '@/components/basic/default-text.vue'
import defaultButton from '@/components/basic/default-button.vue'
import defaultImage from '@/components/basic/default-image.vue'
import defaultImageList from '@/components/basic/default-image-list.vue'
import defaultImagePicker from '@/components/basic/default-image-picker.vue'
import defaultInput from '@/components/basic/default-input.vue'
import defaultInputNumber from '@/components/basic/default-input-number.vue'
import defaultSelect from '@/components/basic/default-select.vue'
import defaultSwitch from '@/components/basic/default-switch.vue'
import defaultCheckbox from '@/components/basic/default-checkbox.vue'
import defaultCheckboxList from '@/components/basic/default-checkbox-list.vue'
import defaultRadioList from '@/components/basic/default-radio-list.vue'
import defaultDatePicker from '@/components/basic/default-date-picker.vue'
import defaultEditor from '@/components/basic/default-editor.vue'
import defaultCascader from '@/components/basic/default-cascader.vue'
import defaultTimeline from '@/components/basic/default-timeline.vue'
import defaultSlider from '@/components/basic/default-slider'
import defaultTimePicker from '@/components/basic/default-time-picker'
import defaultSimpleEditor from '@/components/basic/default-simple-editor'
import defaultRichText from '@/components/basic/default-rich-text'
import defaultTooltip from '@/components/basic/default-tooltip'
import defaultTableText from '@/components/basic/default-table-text'

// 通用组件 common
import defaultUpload from '@/components/common/default-upload.vue'
import defaultForm from '@/components/common/default-form.vue'
import defaultTable from '@/components/common/default-table.vue'
import defaultDialogForm from '@/components/common/default-dialog-form.vue'
import defaultDialogImport from '@/components/common/default-dialog-import.vue'
import wechatUpload from '@/components/common/wechat-upload'

// 业务组件 business
import breadButtonWrap from '@/components/business/bread-button-wrap.vue'
import buttonWrap from '@/components/business/button-wrap.vue'
import pageBox from '@/components/business/page-box.vue'
import pageBoxTitle from '@/components/business/page-box-title.vue'
import pageFixedTitle from '@/components/business/page-fixed-title.vue'
import tabBoxTitle from '@/components/business/tab-box-title.vue'
import transitionBox from '@/components/business/transition-box'

const plugin = {
  install: function (Vue) {
    Vue.component('default-dialog', defaultDialog)
    Vue.component('default-validate', defaultValidate)
    Vue.component('default-text', defaultText)
    Vue.component('default-button', defaultButton)
    Vue.component('default-image', defaultImage)
    Vue.component('default-image-list', defaultImageList)
    Vue.component('default-image-picker', defaultImagePicker)
    Vue.component('default-input', defaultInput)
    Vue.component('default-input-number', defaultInputNumber)
    Vue.component('default-select', defaultSelect)
    Vue.component('default-switch', defaultSwitch)
    Vue.component('default-checkbox', defaultCheckbox)
    Vue.component('default-checkbox-list', defaultCheckboxList)
    Vue.component('default-radio-list', defaultRadioList)
    Vue.component('default-date-picker', defaultDatePicker)
    Vue.component('default-editor', defaultEditor)
    Vue.component('default-cascader', defaultCascader)
    Vue.component('default-timeline', defaultTimeline)
    Vue.component('default-slider', defaultSlider)
    Vue.component('default-time-picker', defaultTimePicker)
    Vue.component('default-simple-editor', defaultSimpleEditor)
    Vue.component('default-rich-text', defaultRichText)
    Vue.component('default-tooltip', defaultTooltip)
    Vue.component('default-table-text', defaultTableText)

    Vue.component('default-upload', defaultUpload)
    Vue.component('default-form', defaultForm)
    Vue.component('default-table', defaultTable)
    Vue.component('default-dialog-form', defaultDialogForm)
    Vue.component('default-dialog-import', defaultDialogImport)
    Vue.component('wechat-upload', wechatUpload)

    Vue.component('bread-button-wrap', breadButtonWrap)
    Vue.component('button-wrap', buttonWrap)
    Vue.component('page-box', pageBox)
    Vue.component('page-box-title', pageBoxTitle)
    Vue.component('page-fixed-title', pageFixedTitle)
    Vue.component('tab-box-title', tabBoxTitle)
    Vue.component('transition-box', transitionBox)
  }
}

export default plugin
