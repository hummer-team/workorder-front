/*
*  @ 全局基础组件混入配置
*  @
*/

const basicItemMixin = {
  data () {
    return {
      // 组件刷新控制标记
      refreshTag: false,
      // 校验结果
      validateData: {
        isSuccess: true,
        errorMessage: ''
      },
      // 内部ui绑定的值
      innerValue: '',
      // 组件label
      label: ''
    }
  },
  props: {
    // 组件值
    value: { default: '' },
    // 组件配置
    data: { type: Object, default: () => { return {} } },
    // 行数据
    rowData: { type: Object, default: null },
    // 校验配置
    validate: { type: Object, default: () => { return {} } }
  },
  watch: {
    value: function (value) {
      this.innerValue = value
    },
    innerValue: function (value) {
      this.$emit('input', value)
      // 通知给父组件的值变更方法, 使用nextTick解决form校验和字段校验执行顺序问题
      this.$nextTick(() => {
        this.$emit('change', value)
      })
    },
    data: function () {
      if (this.dataInit) {
        this.dataInit()
      }
    }
  },
  methods: {
    getItemWrapClass: function (conf = {}) {
      const list = []
      if (this.validateData.isSuccess === false) {
        list.push('validate-error')
      }
      if (conf.itemType === 'input' && conf.type === 'textarea') {
        list.push('default-textarea')
      }
      return list
    },
    // 初始化组件值
    valueInit: function () {
      this.innerValue = this.value
    },
    // 字段校验
    doValidate: async function () {
      if (this.$refs['validate']) {
        await this.$refs['validate'].validate()
      }
      return this.validateData
    },
    // 校验组件上传校验结果
    setValidateData: function (data) {
      this.validateData = data
    },
    // 清空校验结果
    clearValidateData: function (data) {
      this.validateData = {
        isSuccess: true,
        errorMessage: ''
      }
      if (this.$refs['validate']) {
        this.$refs['validate'].clearValidate()
      }
    },
    // 手动设置校验组件的校验结果
    setValidateObjError: function (message) {
      if (this.$refs['validate']) {
        this.$refs['validate'].setValidateError(message)
      }
    },
    // 刷新组件
    refresh: function () {
      this.refreshTag = true
      this.$nextTick(() => {
        this.refreshTag = false
      })
    }
  },
  created: function () {
    this.valueInit()
    if (this.dataInit) {
      this.dataInit()
    }
  }
}

export default basicItemMixin