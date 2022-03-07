/*
*  @ 全局基础开关组件
*  @
*/
<template>
  <div class="basic-item-wrap default-switch" :class="getItemWrapClass()">
    <!-- <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate> -->
    <el-switch v-model="innerValue" :disabled="getDisabled()" :width="switchWidth" :active-text="activeText" :inactive-text="inactiveText" :active-value="activeValue" :inactive-value="inactiveValue" :active-color="activeColor" :inactive-color="inactiveColor" @change="onChange">
    </el-switch>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-switch',
  mixins: [basicItemMixin],
  data () {
    return {
      // 是否禁用
      disabled: false,
      // switch 的宽度（像素）
      switchWidth: 40,
      // switch 打开时的文字描述
      activeText: '',
      // switch 关闭时的文字描述
      inactiveText: '',
      // switch 打开时的值
      activeValue: true,
      // switch 关闭时的值
      inactiveValue: false,
      // switch 打开时的背景色
      activeColor: '#ffb600',
      // switch 关闭时的背景色
      inactiveColor: '#C0CCDA'
    }
  },
  props: {
  },
  computed : {
  },
  watch: {
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { label, disabled, switchWidth, activeText, inactiveText, activeValue, inactiveValue, activeColor, inactiveColor } = this.data
      this.label = this.isSet(label) ? label : ''
      this.disabled = this.isSet(disabled) ? disabled : false
      this.switchWidth = this.isSet(switchWidth) ? switchWidth : 40
      this.activeText = this.isSet(activeText) ? activeText : ''
      this.inactiveText = this.isSet(inactiveText) ? inactiveText : ''
      this.activeValue = this.isSet(activeValue) ? activeValue : true
      this.inactiveValue = this.isSet(inactiveValue) ? inactiveValue : false
      this.activeColor = this.isSet(activeColor) ? activeColor : '#ffb600'
      this.inactiveColor = this.isSet(inactiveColor) ? inactiveColor : '#C0CCDA'
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled(this.rowData)
      } else {
        return this.disabled
      }
    },
    // switch 状态发生变化时的回调函数
    onChange: function (newVal) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({ newVal, oldVal: this.value, row: this.rowData })
      }
    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-switch{
  .el-switch{
    // 尝试修复上下居中的问题
    vertical-align: text-top;
  }
}
</style>
