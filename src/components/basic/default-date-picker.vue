/*
*  @ 全局基础日期选择组件
*  @
*/
<template>
  <div class="basic-item-wrap default-date-picker" :class="getItemWrapClass()" v-if="!refreshTag">
    <default-validate ref="validate" type="date-picker" :value="innerValue" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-date-picker v-model="innerValue" :type="pickType" :format="format" :value-format="valueFormat" :readonly="readonly" :disabled="getDisabled()" :editable="editable" :clearable="clearable" :placeholder="placeholder" :align="align" :picker-options="getPickerOptions()" :prefix-icon="prefixIcon" :clear-icon="clearIcon" @change="onChange" @blur="onBlur" @focus="onFocus" :default-time="defaultTime">
    </el-date-picker>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-date-picker',
  mixins: [basicItemMixin],
  data () {
    return {
      // 显示类型 year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange
      type: '',
      // 显示在输入框中的格式 https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi
      format: 'yyyy-MM-dd',
      // 可选，绑定值的格式。不指定则绑定值为 Date 对象
      valueFormat: 'yyyy-MM-dd',
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
      // 对齐方式
      align: 'left',
      // 自定义头部图标的类名
      prefixIcon: 'el-icon-date',
      // 自定义清空图标的类名
      clearIcon: 'el-icon-circle-close',
      // 默认时间
      defaultTime: []
    }
  },
  props: {
  },
  computed : {
    pickType: function () {
      return this.getPickType()
    }
  },
  watch: {
    pickType: function (type, oldType) {
      if (oldType) {
        this.refreshTag = true
        this.dataInit()
        this.$nextTick(() => {
          this.refreshTag = false
        })
      }
    }
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { label, pickType, format, valueFormat, readonly, disabled, editable, clearable, placeholder, align, prefixIcon, clearIcon, defaultTime } = this.data
      this.label = this.isSet(label) ? label : ''
      this.type = this.isSet(pickType) ? pickType : 'date'
      this.format = this.isSet(format) ? format : 'yyyy-MM-dd'
      this.valueFormat = this.isSet(valueFormat) ? valueFormat : 'yyyy-MM-dd'
      this.readonly = this.isSet(readonly) ? readonly : false
      this.disabled = this.isSet(disabled) ? disabled : false
      this.editable = this.isSet(editable) ? editable : true
      this.clearable = this.isSet(clearable) ? clearable : true
      this.placeholder = this.isSet(placeholder) ? placeholder : '请选择' + label
      this.align = this.isSet(align) ? align : 'left'
      this.prefixIcon = this.isSet(prefixIcon) ? prefixIcon : 'el-icon-date'
      this.clearIcon = this.isSet(clearIcon) ? clearIcon : 'el-icon-circle-close'
      this.defaultTime = this.isSet(defaultTime) ? defaultTime : null

      if (this.pickType === 'datetime') {
        if (!format) {
          this.format = 'yyyy-MM-dd HH:mm:ss'
        }
        if (!valueFormat) {
          this.valueFormat = 'yyyy-MM-dd HH:mm:ss'
        }
      }

      if (this.pickType === 'date' && !this.data.valueFormat) {
        if (this.data.hms === 'start') {
          this.valueFormat += ' 00:00:00'
        } else if (this.data.hms === 'end') {
          this.valueFormat += ' 23:59:59'
        }
      }
    },
    // 获取组件type
    getPickType: function () {
      if (this.isFunction(this.type)) {
        return this.type(this.rowData)
      } else {
        return this.type
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
    // 组装 picker-options
    getPickerOptions: function () {
      const option = {}
      if (this.rowData) {
        const { maxDateField, minDateField, laterNow, earlierNow, timeRange } = this.data
        let maxDate, minDate
        if (maxDateField) {
          maxDate = this.rowData[maxDateField]
          if (typeof (maxDate) === 'string') {
            if (maxDate.length === 10) maxDate += ' 00:00:00'
            maxDate = new Date(maxDate)
          } else if (!this.isDate(maxDate)) {
            maxDate = null
          }
        }

        if (minDateField) {
          minDate = this.rowData[minDateField]
          if (typeof (minDate) === 'string') {
            if (minDate.length === 10) minDate += ' 00:00:00'
            minDate = new Date(minDate)
          } else if (!this.isDate(minDate)) {
            minDate = null
          }
        }
        // 目前用于查询三个月以内的客户数据, timeRange单位: 天
        if (timeRange && timeRange > 0) {
          let tempMaxDate, tempMinDate
          // 深拷贝日期对象
          if (maxDate) {
            tempMaxDate = new Date(maxDate.valueOf())
            tempMaxDate.setDate(tempMaxDate.getDate() - timeRange)
          }
          if (minDate) {
            tempMinDate = new Date(minDate.valueOf())
            tempMinDate.setDate(tempMinDate.getDate() + timeRange)
          }
          option.disabledDate = (time) => {
            const nowDate = new Date(new Date().toLocaleDateString())
            if ((maxDate && (time.getTime() > maxDate.getTime())) || (tempMaxDate && (time.getTime() < tempMaxDate.getTime()))) {
              return true
            }
            if ((minDate && (time.getTime() < minDate.getTime())) || (tempMinDate && (time.getTime() > tempMinDate.getTime()))) {
              return true
            }
            if (laterNow && time.getTime() < nowDate.getTime()) {
              return true
            }
            if (earlierNow && time.getTime() > nowDate.getTime()) {
              return true
            }
            return false
          }
        } else {
          option.disabledDate = (time) => {
            const nowDate = new Date(new Date().toLocaleDateString())
            if (maxDate && (time.getTime() > maxDate.getTime())) {
              return true
            }
            if (minDate && (time.getTime() < minDate.getTime())) {
              return true
            }
            if (laterNow && time.getTime() < nowDate.getTime()) {
              return true
            }
            if (earlierNow && time.getTime() > nowDate.getTime()) {
              return true
            }
            return false
          }
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
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({ value: this.value, row: this.rowData })
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
