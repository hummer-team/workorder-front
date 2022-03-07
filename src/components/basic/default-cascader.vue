/*
*  @ 全局基础级联选择器组件
*  @
*/
<template>
  <div class="basic-item-wrap default-cascader" :class="getItemWrapClass()">
    <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-cascader v-model="innerValue" :options="getOptions()" :props="props" :placeholder="placeholder" :disabled="getDisabled()" :clearable="clearable" :show-all-levels="showAllLevels" :collapse-tags="collapseTags" :separator="separator" :filterable="filterable" :filter-method="filterMethod" :debounce="debounce" :before-filter="beforeFilter" :popper-class="popperClass" @change="onChange" @blur="onBlur" @focus="onFocus" @expand-change="onExpandChange" @visible-change="onVisibleChange" @remove-tag="onRemoveTag">
      <template slot="empty">
        <div class="no-data">
          暂无数据
        </div>
      </template>
    </el-cascader>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-cascader',
  mixins: [basicItemMixin],
  data () {
    return {
      // 选项数据列表 code，name
      options: [],
      // 配置选项
      props: {},
      // 占位符
      placeholder: '请选择',
      // 是否禁用
      disabled: false,
      // 是否可以清空选项
      clearable: false,
      // 输入框中是否显示选中值的完整路径
      showAllLevels: true,
      // 多选模式下是否折叠Tag
      collapseTags: false,
      // 选项分隔符
      separator: '>',
      // 是否可搜索
      filterable: false,
      // 自定义搜索逻辑
      filterMethod: null,
      // 搜索关键词输入的去抖延迟，毫秒
      debounce: 300,
      // 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选
      beforeFilter: null,
      // 自定义浮层类名
      popperClass: ''
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
      const { label, options, props, placeholder, disabled, clearable, showAllLevels, collapseTags, separator, filterable, filterMethod, debounce, beforeFilter, popperClass } = this.data
      this.label = this.isSet(label) ? label : ''
      this.options = this.isSet(options) ? options : []
      this.props = this.isSet(props) ? props : {}
      this.placeholder = this.isSet(placeholder) ? placeholder : '请选择' + label
      this.disabled = this.isSet(disabled) ? disabled : false
      this.clearable = this.isSet(clearable) ? clearable : false
      this.showAllLevels = this.isSet(showAllLevels) ? showAllLevels : true
      this.collapseTags = this.isSet(collapseTags) ? collapseTags : false
      this.separator = this.isSet(separator) ? separator : '>'
      this.filterable = this.isSet(filterable) ? filterable : false
      this.filterMethod = this.isSet(filterMethod) ? filterMethod : null
      this.debounce = this.isSet(debounce) ? debounce : 300
      this.beforeFilter = this.isSet(beforeFilter) ? beforeFilter : null
      this.popperClass = this.isSet(popperClass) ? popperClass : ''
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
    // 选中值发生变化时触发
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value})
      }
      if (this.isFunction(this.data.afterChange)) {
        setTimeout(() => {
          this.data.afterChange({value})
        }, 0)
      }
    },
    // 当 input 失去焦点时触发
    onBlur: function () {

    },
    // 当 input 获得焦点时触发
    onFocus: function () {

    },
    // 当展开节点发生变化时触发
    onExpandChange: function () {

    },
    // 下拉框出现/隐藏时触发
    onVisibleChange: function () {

    },
    // 多选模式下移除tag时触发
    onRemoveTag: function () {

    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-cascader{

}
</style>
