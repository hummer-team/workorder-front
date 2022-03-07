/*
*  @ 全局基础勾选列表组件
*  @
*/
<template>
  <div class="basic-item-wrap default-checkbox-list" :class="getItemWrapClass()">
    <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-checkbox-group v-model="innerValue" :disabled="getDisabled()" :min="min" :max="max" :text-color="textColor" :fill="fill" @change="onChange">
      <el-checkbox v-for="opt in getOptions()" :key="opt.code" :label="opt.code" :disabled="checkOptionDisabled(opt)" :indeterminate="indeterminate">{{opt.name}}</el-checkbox>
      }
    </el-checkbox-group>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-checkbox-list',
  mixins: [basicItemMixin],
  data () {
    return {
      // 选项数据列表 code，name
      options: [],
      // 是否禁用
      disabled: false,
      // 可被勾选的 checkbox 的最小数量
      min: undefined,
      // 可被勾选的 checkbox 的最大数量
      max: undefined,
      // 按钮形式的 Checkbox 激活时的文本颜色
      textColor: '#ffffff',
      // 按钮形式的 Checkbox 激活时的填充色和边框色
      fill: '#409EFF',
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
      const { label, options, disabled, min, max, textColor, fill, indeterminate } = this.data
      this.label = this.isSet(label) ? label : ''
      this.options = this.isSet(options) ? options : []
      this.disabled = this.isSet(disabled) ? disabled : false
      this.min = this.isSet(min) ? min : undefined
      this.max = this.isSet(max) ? max : undefined
      this.textColor = this.isSet(textColor) ? textColor : '#ffffff'
      this.fill = this.isSet(fill) ? fill : '#409EFF'
      this.indeterminate = this.isSet(indeterminate) ? indeterminate : false
    },
    // 获取选项列表
    getOptions: function () {
      if (this.isFunction(this.options)) {
        return this.options()
      } else {
        return this.options
      }
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled(this.rowData)
      } else {
        return this.disabled
      }
    },
    // 判断选择是否禁用
    checkOptionDisabled: function (opt) {
      if (this.isFunction(opt.disabled)) {
        return opt.disabled(this.rowData)
      } else {
        return opt.disabled
      }
      return false
    },
    // 当绑定值变化时触发的事件
    onChange: function () {

    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-checkbox-list{
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
