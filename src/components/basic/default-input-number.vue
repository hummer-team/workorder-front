/*
*  @ 全局基础数字输入框组件
*  @
*/
<template>
  <div class="basic-item-wrap default-input-number" :class="getItemWrapClass()">
    <default-validate ref="validate" type="input" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-input-number v-model="innerValue" :max="max" :min="min" :step="step" :step-strictly="stepStrictly" :precision="precision" :disabled="getDisabled()" :controls="controls" :controls-position="controlsPosition" :placeholder="placeholder" @blur="onBlur" @focus="onFocus" @change="onChange">
    </el-input-number>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-input-number',
  mixins: [basicItemMixin],
  data () {
    return {
      // 设置计数器允许的最大值
      max: undefined,
      // 设置计数器允许的最小值
      min: undefined,
      // 计数器步长
      step: 1,
      // 是否只能输入 step 的倍数
      stepStrictly: false,
      // 数值精度
      precision: undefined,
      // 是否禁用计数器
      disabled: false,
      // 是否使用控制按钮
      controls: true,
      // 控制按钮位置
      controlsPosition : '',
      // 输入框默认 placeholder
      placeholder: ''
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
      const { label, max, min, step, stepStrictly, precision, disabled, controls, controlsPosition, placeholder } = this.data
      this.label = this.isSet(label) ? label : ''
      this.max = this.isSet(max) ? max : undefined
      this.min = this.isSet(min) ? min : undefined
      this.step = this.isSet(step) ? step : 1
      this.stepStrictly = this.isSet(stepStrictly) ? stepStrictly : false
      this.precision = this.isSet(precision) ? precision : undefined
      this.disabled = this.isSet(disabled) ? disabled : false
      this.controls = this.isSet(controls) ? controls : true
      this.controlsPosition = this.isSet(controlsPosition) ? controlsPosition : ''
      this.placeholder = this.isSet(placeholder) ? placeholder : '请输入' + label
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled(this.rowData)
      } else {
        return this.disabled
      }
    },
    // 在 Input 失去焦点时触发
    onBlur: function () {

    },
    // 在 Input 获得焦点时触发
    onFocus: function () {

    },
    // 绑定值被改变时触发
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value})
      }
      if (this.isFunction(this.data.afterChange)) {
        setTimeout(() => {
          this.data.afterChange({value})
        }, 0)
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
.default-input-number{

}
</style>
