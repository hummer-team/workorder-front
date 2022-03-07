/*
*  @ 全局基础日期选择组件
*  @
*/
<template>
  <div class="basic-item-wrap default-time-picker" :class="getItemWrapClass()" v-if="!refreshTag">
    <default-validate ref="validate" type="time-picker" :value="innerValue" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-time-picker v-model="innerValue" :value-format="valueFormat" :readonly="readonly" :disabled="getDisabled()" :editable="editable" :clearable="clearable" :placeholder="placeholder" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder" :is-range="isRange"  :align="align" :picker-options="getPickerOptions()" :default-value="defaultValue" :prefix-icon="prefixIcon" :clear-icon="clearIcon" @change="onChange" @blur="onBlur" @focus="onFocus">
    </el-time-picker>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-time-picker',
  mixins: [basicItemMixin],
  data () {
    return {
      // 可选，绑定值的格式。不指定则绑定值为 Date 对象
      valueFormat: 'HH:mm:ss',
      // 完全只读
      readonly: false,
      // 是否禁用
      disabled: false,
      // 文本框可输入
      editable: true,
      // 是否显示清除按钮
      clearable: true,
      // 非范围选择时的占位内容
      placeholder: '',
      // 范围选择时开始框占位内容
      startPlaceholder: '',
      // 范围选择时结束框占位内容
      endPlaceholder: '',
      // 是否范围选择
      isRange: false,
      // 对齐方式
      align: 'left',
      // 选择器打开时的默认时间
      defaultValue: null,
      // 自定义头部图标的类名
      prefixIcon: 'el-icon-time',
      // 自定义清空图标的类名
      clearIcon: 'el-icon-circle-close'
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
      const { label, valueFormat, readonly, disabled, editable, clearable, placeholder, startPlaceholder, endPlaceholder, isRange, align, defaultValue, prefixIcon, clearIcon, selectableRange } = this.data
      this.label = this.isSet(label) ? label : ''
      this.valueFormat = this.isSet(valueFormat) ? valueFormat : 'HH:mm:ss'
      this.readonly = this.isSet(readonly) ? readonly : false
      this.disabled = this.isSet(disabled) ? disabled : false
      this.editable = this.isSet(editable) ? editable : true
      this.clearable = this.isSet(clearable) ? clearable : true
      this.placeholder = this.isSet(placeholder) ? placeholder : '请选择' + label
      this.startPlaceholder = this.isSet(startPlaceholder) ? startPlaceholder : '请选择' + label
      this.endPlaceholder = this.isSet(endPlaceholder) ? endPlaceholder : '请选择' + label
      this.isRange = this.isSet(isRange) ? isRange : false
      this.align = this.isSet(align) ? align : 'left'
      this.defaultValue = this.isSet(defaultValue) ? defaultValue : new Date()
      this.prefixIcon = this.isSet(prefixIcon) ? prefixIcon : 'el-icon-date'
      this.clearIcon = this.isSet(clearIcon) ? clearIcon : 'el-icon-circle-close'
      this.selectableRange = this.isSet(selectableRange) ? selectableRange : ''
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled(this.rowData)
      } else {
        return this.disabled
      }
    },
    // 组装 picker-options
    getPickerOptions: function () {
      const option = {}
      if (this.rowData) {
        if (this.selectableRange) {
          option.selectableRange = this.selectableRange
        }
      }
      return option
    },
    // 用户确认选定的值时触发
    onChange: function () {
      // 暂时用这种方法处理，中间会多触发一次赋值null
      if (this.innerValue === null) {
        this.$nextTick(() => {
          this.innerValue = ''
        })
      }
    },
    // 当 input 失去焦点时触发
    onBlur: function () {

    },
    // 当 input 获得焦点时触发
    onFocus: function () {

    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-date-picker{
}
</style>
