/*
*  @ 全局基础勾选组件
*  @
*/
<template>
  <div class="basic-item-wrap default-checkbox" :class="getItemWrapClass()">
    <!-- <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate> -->
    <el-checkbox v-model="innerValue" :disabled="getDisabled()" :true-label="trueLabel" :false-label="falseLabel" @change="onChange" :indeterminate="indeterminate">
    </el-checkbox>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-checkbox',
  mixins: [basicItemMixin],
  data () {
    return {
      // 是否禁用
      disabled: false,
      // 选中时的值
      trueLabel: '',
      // 没有选中时的值
      falseLabel: '',
      // 是否显示边框
      border: false,
      // 样式控制
      indeterminate: false
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
      const { label, disabled, trueLabel, falseLabel, border, indeterminate } = this.data
      this.label = this.isSet(label) ? label : ''
      this.disabled = this.isSet(disabled) ? disabled : false
      this.trueLabel = this.isSet(trueLabel) ? trueLabel : ''
      this.falseLabel = this.isSet(falseLabel) ? falseLabel : ''
      this.border = this.isSet(border) ? border : false
      this.indeterminate = this.isSet(indeterminate) ? indeterminate : false
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled(this.rowData)
      } else {
        return this.disabled
      }
    },
    // 当绑定值变化时触发的事件
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        return this.data.onChange({value, row: this.rowData})
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
.default-checkbox{
  .el-checkbox{
    >>> .el-checkbox__inner{
      width: 20px;
      height: 20px;
      &::after{
        height: 10px;
        width: 5px;
        left: 6px;
      }
      &::before{
        top: 8px;
      }
    }
  }
}
</style>
