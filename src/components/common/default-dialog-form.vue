<template>
  <default-dialog ref="dialog" :title="dialog.title" :width="dialog.width" :button-list="buttonList" @close="afterDialogClose">
    <div class="dialog-wrap">
      <!-- 查询表单区域 -->
      <default-form ref="form" v-loading="formLoading" :form-data="formData" :form-items="formItems" :form-style="formActStyle" :label-position="labelPosition" :rules="rules"></default-form>
    </div>
  </default-dialog>
</template>

<script>
export default {
  name: 'default-dialog-form',
  data () {
    return {
      // 弹框配置信息
      dialog: {
        title: '表单弹框',
        width: 600
      },
      formActStyle: {},
      buttonList: [],
      defaultFormStyle: {
        itemSpan: 12
      },
      defaultButtonList: [
        { label: '重置', loading: () => this.formLoading, function: this.resetForm, isShow: this.isShowDefaultBtn && this.isShowResetBtn },
        { label: '关闭', loading: () => this.formLoading, function: this.closeDialog , isShow: this.isShowDefaultBtn && this.isShowCloseBtn },
        { label: '提交', type: 'primary', loading: () => this.formLoading, function: this.doSubmit,isShow: this.isShowDefaultBtn && this.isShowSubmitBtn }
      ]
    }
  },
  props: {
    title: { type: String, default: '' },
    width: { default: 0 },
    formLoading: { type: Boolean, default: false },
    formStyle: { type: Object, default: () => { return {} } },
    formData: { type: Object, default: () => { return {} } },
    formItems: { type: Array, default: () => [] },
    formButtonList: { type: Array, default: () => [] },
    formSubmit: { type: Function, default: null },
    onDialogClose: { type: Function, default: null },
    isShowDefaultBtn: { type: Boolean, default: true },
    isShowResetBtn: { type: Boolean, default: true },
    isShowCloseBtn: { type: Boolean, default: true },
    isShowSubmitBtn: { type: Boolean, default: true },
    labelPosition: { type: String, default: 'right' },
    rules: { type: Object, default: () => { return {} } }
  },
  computed : {},
  watch: {
    title: function (title) {
      this.dialog.title = title
    }
  },
  methods:{
    // 初始化配置参数
    dataInit: function () {
      this.dialog.title = this.title || '表单弹框'
      this.dialog.width = this.width || 600
      this.buttonList = this.defaultButtonList.concat(this.formButtonList)
      this.formActStyle = { ...this.defaultFormStyle, ...this.formStyle }
    },
    // 重置表单
    resetForm: function () {
      this.$refs['form'].resetForm()
    },
    // 重置表单校验样式
    resetValidate: function () {
      if (this.$refs['form']) {
        this.$refs['form'].resetValidate()
      }
    },
    openDialog: function () {
      this.resetValidate()
      this.$refs['dialog'].openDialog()
    },
    // 关闭弹框
    closeDialog: function () {
      this.$refs['dialog'].closeDialog()
    },
    // 弹框关闭之后
    afterDialogClose: function () {
      this.resetValidate()
      if (this.onDialogClose) {
        this.onDialogClose()
      }
      setTimeout(() => {
        this.dialogDisplay = false
      }, 500)
    },
    // 提交表单
    doSubmit: async function () {
      
      const valid = await this.$refs['form'].validateForm()
      if (!valid) return
      if (this.isFunction(this.formSubmit)) {
        this.formSubmit(this.formData)
      }
    }
  },
  created: function () {
    this.dataInit()
  },
  mounted: function () {
    this.$on('openDialog', this.openDialog)
    this.$on('closeDialog', this.$refs['dialog'].closeDialog)
  }
}
</script>

<style lang="scss" scoped>

</style>
