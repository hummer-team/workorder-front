/*
*  @ 全局基础输入框组件
*  @
*/
<template>
  <div class="basic-item-wrap default-slider">
    <el-slider v-model="innerValue" :min="min" :max="max" :marks="marks" :step="step" :show-tooltip="showToolTip" :disabled="getDisabled()" :format-tooltip="formatToolTip" @change="onChange"></el-slider>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-select',
  mixins: [basicItemMixin],
  data () {
    return {
      // 最小值
      min: 0,
      // 最大值
      max: 0,
      // 标记, key 的类型必须为 number 且取值在闭区间 [min, max] 内
      marks: null,
      // 步长
      step: 1,
      // 是否显示 tooltip
      showToolTip: true,
      // 格式化 tooltip message
      formatToolTip: null
    }
  },
  props: {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { min, max, marks, step, showToolTip } = this.data
      this.min = this.isSet(min) ? min : 0
      this.max = this.isSet(max) ? max : 0
      this.marks = this.isSet(marks) ? marks : null
      this.step = this.isSet(step) ? step : 1
      this.showToolTip = this.isSet(showToolTip) ? showToolTip : true

      if (this.isFunction(this.data.formatToolTip)) {
        this.formatToolTip = this.data.formatToolTip
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
    // 选中值发生变化时触发
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange(value, this.rowData)
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
.default-select{
  &.is-multiple{
    min-height: 36px;
    height: auto;

    >>> .el-select{
      min-height: 36px;
      height: auto;
    }
  }
}
</style>
