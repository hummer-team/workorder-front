/*
*  @ 全局基础单选列表组件
*  @
*/
<template>
  <div class="basic-item-wrap default-radio-list" :class="getItemWrapClass()">
    <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-radio-group v-model="innerValue" :disabled="getDisabled()" :text-color="textColor" :fill="fill" @change="onChange">
      <el-radio v-for="opt in options" :key="opt.code" :label="opt.code" :disabled="checkOptionDisabled(opt)">{{opt.name}}</el-radio>
      }
    </el-radio-group>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-radio-list',
  mixins: [basicItemMixin],
  data () {
    return {
      // 选项数据列表 code，name
      options: [],
      // 是否禁用
      disabled: false,
      // 按钮形式的 Radio 激活时的文本颜色
      textColor: '#ffffff',
      // 按钮形式的 Radio 激活时的填充色和边框色
      fill: '#409EFF'
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
      const { label, options, disabled, textColor, fill } = this.data
      this.label = this.isSet(label) ? label : ''
      this.options = this.isSet(options) ? (this.isFunction(options) ? options() : options) : []
      this.disabled = this.isSet(disabled) ? disabled : false
      this.textColor = this.isSet(textColor) ? textColor : '#ffffff'
      this.fill = this.isSet(fill) ? fill : '#409EFF'
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
      if (opt.disabled === true) return true
      return false
    },
    // 绑定值变化时触发的事件
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange(this.rowData, value)
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
.default-radio-list{
  .el-radio{
    >>> .el-radio__inner{
      width: 20px;
      height: 20px;
      &::after{
        height: 10px;
        width: 10px;
      }
    }
  }
}
</style>
