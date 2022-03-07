/*
*  @ 全局基础弹框组件
*  @
*/
<template>
  <el-dialog custom-class="default-dialog" :title="dialog.title" :visible.sync="dialog.visible" :append-to-body="true" :width="dialogWidth" :before-close="beforeDialogClose" :lock-scroll="false">
    <slot v-loading="dialog.loading"></slot>
    <div v-if="buttonList.length > 0" class="btn-wrap" slot="footer">
      <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'default-dialog',
  data () {
    return {
      dialog: {
        loading: false,
        title: '弹出框',
        width: '1000px',
        visible: false
      }
    }
  },
  props: {
    // 弹框标题
    title: { type: String, default: '' },
    // 弹框宽度
    width: { default: '' },
    // 弹框loading 这个暂时没啥用
    loading: { default: false },
    // 底部按钮配置列表
    buttonList: {type: Array, default: () => { return [] }}
  },
  computed : {
    dialogWidth: function () {
      let width = this.dialog.width || 800
      if (this.isString(width)) {
        return width
      }
      return width + 'px'
    }
  },
  watch: {
    title: function (title) {
      this.dialog.title = title
    },
    width: function (width) {
      this.dialog.width = width
    },
    loading: function (loading) {
      this.dialog.loading = loading
    }
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      if (this.title) {
        this.dialog.title = this.title
      }
      if (this.width) {
        this.dialog.width = this.width
      }
      if (this.isSet(this.loading)) {
        this.dialog.loading = this.loading
      }
    },
    // 打开弹框
    openDialog: function () {
      this.dialog.visible = true
    },
    // 关闭弹框
    closeDialog: function () {
      this.dialog.visible = false
      this.$emit('close')
    },
    beforeDialogClose: function (done) {
      done()
      this.$emit('close')
    }
  },
  created: function () {
    this.dataInit()
  },
  mounted: function () {
    this.$on('openDialog', this.openDialog)
    this.$on('closeDialog', this.openDialog)
  }
}
</script>

<style lang="scss" scoped>
.default-dialog{
}
</style>
