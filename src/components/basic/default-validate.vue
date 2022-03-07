/*
*  @ 全局基础组件校验栏
*  @
*/
<template>
  <div class="default-validate" :class="isSuccess ? rows > 1 ? 'textarea-validate hide' : 'input-validate hide' : rows > 1 ? 'textarea-validate show' : 'input-validate show'">
    <span>{{errorMessage}}</span>
  </div>
</template>

<script>
import validator from '@/utils/validator'
export default {
  name: 'default-validate',
  data () {
    return {
      validator: validator.validator,
      // 是否必填
      isRequired: false,
      // 自定义校验方法名称列表
      customize: [],
      // 是否校验通过
      isSuccess: true,
      // 校验错误信息
      errorMessage: ''
    }
  },
  props: {
    // 组件校验的值
    value: { default: '' },
    // 组件校验对象
    valueObj: { type: Object, default: () => { return {} } },
    // 组件类型
    type: { type: String, default: 'input' },
    // 组件label
    label: { type: String, default: '' },
    // 组件配置
    data: { type: Object, default: () => { return {} } },
    // 行数据
    rowData: { type: Object, default: null },
    // input的rows
    rows: { type: Number, default: 1}
  },
  computed : {
  },
  watch: {
    value: function (value) {
      this.validate()
    },
    valueObj: {
      handler() {
        this.validateObj()
      },
      deep: true
    }
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { isRequired, customize } = this.data
      this.isRequired = this.isSet(isRequired) ? isRequired : false
      this.customize = this.isSet(customize) ? customize : []
    },
    // 获取是否必填
    getIsRequired: function () {
      if (this.isFunction(this.isRequired)) {
        return this.isRequired(this.rowData)
      } else {
        return this.isRequired
      }
    },
    // 字段校验
    validate: async function () {
      this.isSuccess = true
      if (Boolean(this.getIsRequired()) === true) {
        if (this.type === 'multiple-coupon-image') {
          if (this.value === '' || this.value === null || this.value.length < this.data.picNum) {
            this.setValidateError('请在每一栏内都上传一张优惠券图片')
            return
          }
        }
        if (this.value === '' || this.value === null || JSON.stringify(this.value) === '[]' || JSON.stringify(this.value) === '{}') {
          if (this.type === 'select' || this.type === 'outbox' || this.type === 'date-picker' || this.type === 'color-picker') {
            this.setValidateError('请选择' + this.label)
            return
          } else if (this.type === 'image') {
            this.setValidateError('请上传图片')
          } else {
            this.setValidateError('请输入' + this.label)
            return
          } 
        }
      }
      let customize
      if (this.isFunction(this.customize) && this.customize(this.rowData).length && this.value) {
        customize = this.customize(this.rowData)
      } else if (this.customize.length && this.value) {
        customize = this.customize
      }
      if (customize && customize.length) {
        for (let key in customize) {
          const validatorName = customize[key]
          if (this.validator[validatorName]) {
            const { success, errorMsg } = this.validator[validatorName](this.value)
            if (!success) {
              this.setValidateError(errorMsg)
              return
            }
          }
        }
      }
      if (this.isFunction(this.data.function)) {
        const { success, errorMsg } = this.data.function({value: this.value, row: this.rowData})
        if (!success) {
          this.setValidateError(errorMsg)
          return
        }
      }
      this.submitData()
    },
    // 对象校验
    validateObj: async function () {
      this.isSuccess = true
      if (this.customize.length && this.valueObj) {
        for (let key in this.customize) {
          const validatorName = this.customize[key]
          if (this.validator[validatorName]) {
            const { success, errorMsg } = this.validator[validatorName](this.valueObj)
            if (!success) {
              this.setValidateError(errorMsg)
              return
            }
          }
        }
      }
      this.submitData()
    },
    setValidateError: function (message) {
      this.isSuccess = false
      this.errorMessage = message

      this.submitData()
    },
    clearValidate: function () {
      this.isSuccess = true
      this.errorMessage = ''
    },
    submitData: function () {
      const data = {
        isSuccess: this.isSuccess,
        errorMessage: this.errorMessage
      }
      this.$emit('setValidateData', data)
    }
  },
  created: function () {
    this.dataInit()
  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.textarea-validate{
  top: -10px;
}
.input-validate{
  bottom: 32px;
}
.default-validate{
  position: absolute;
  left: 8px;
  right: 8px;
  z-index: 1;
  line-height: 0;
  text-align: left;
  transition: all 0.2s linear;
  transform-origin: bottom;

  &.hide{
    opacity: 0;
    transform: scaleY(0);
  }

  span{
    background-color: #fff;
    display: inline-block;
    border-radius: 6px;
    line-height: 14px;
    font-size: 12px;
    color: $color-red;
    padding: 0 8px;
  }
}
</style>
