/*
*  @ 全局基础输入框组件
*  @
*/
<template>
  <div class="basic-item-wrap default-select" :class="getSelectItemWrapClass()">
    <default-validate ref="validate" type="select" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <el-select v-model="innerValue" :multiple="multiple" :disabled="getDisabled()" :clearable="clearable" :collapse-tags="collapseTags" :multiple-limit="multipleLimit" :autocomplete="autocomplete" :placeholder="placeholder" :filterable="filterable" :allow-create="allowCreate" @change="onChange" @visible-change="onVisibleChange" @remove-tag="onRemoveTag" @clear="onClear" @blur="onBlur" @focus="onFocus" :loading="loading" :class="notAllowDelete ? 'no-close' : ''">
      <el-option v-for="opt in lazy ? lazyOptions : getOptions()" :key="opt[optionCode]" :value="opt[optionCode]" :label="opt[optionName]" :disabled="checkOptionDisabled(opt)">
        <template v-if="getSlot(opt)">
          <span v-html="getSlot(opt)"></span>
        </template>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-select',
  mixins: [basicItemMixin],
  data () {
    return {
      // 选项数据列表 code，name
      options: [],
      // options里面用作value的字段
      optionCode: 'code',
      // options里面用作label的字段
      optionName: 'name',
      // 判断option是否可选的统一方法
      optionDisabled: null,
      // 是否多选
      multiple: false,
      // 是否禁用
      disabled: false,
      // 是否可以清空选项
      clearable: false,
      // 多选时是否将选中值按文字的形式展示
      collapseTags: false,
      // 多选时用户最多可以选择的项目数，为 0 则不限制
      multipleLimit: 0,
      // select input 的 autocomplete 属性
      autocomplete: '',
      // 占位符
      placeholder: '请选择',
      // 是否可搜索
      filterable: false,
      // 是否允许用户创建新条目，需配合 filterable 使用
      allowCreate: false,
      // 是否懒加载
      lazy: false,
      // 懒加载options, 打开select框时加载
      lazyOptions: [],
      // slot
      slot: '',
      // loading
      loading: false,
      notAllowDelete: false
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
      const { label, options, optionCode, optionName, optionDisabled, multiple, placeholder, clearable, disabled, filterable, allowCreate, lazy, slot, notAllowDelete } = this.data
      this.label = this.isSet(label) ? label : ''
      this.options = this.isSet(options) ? options : []
      this.optionCode = this.isSet(optionCode) ? optionCode : 'code'
      this.optionName = this.isSet(optionName) ? optionName : 'name'
      this.optionDisabled = this.isSet(optionDisabled) ? optionDisabled : null
      this.multiple = this.isSet(multiple) ? multiple : false
      this.placeholder = this.isSet(placeholder) ? placeholder : '请选择' + label
      this.clearable = this.isSet(clearable) ? clearable : false
      this.disabled = this.isSet(disabled) ? disabled : false
      this.filterable = this.isSet(filterable) ? filterable : false
      this.allowCreate = this.isSet(allowCreate) ? allowCreate : false
      this.lazy = this.isSet(lazy) ? lazy : false
      this.slot = this.isSet(slot) ? slot : false
      this.notAllowDelete = this.isFunction(notAllowDelete) ? notAllowDelete() : false

      if (this.allowCreate === true) {
        this.filterable = true
      }
    },
    getSelectItemWrapClass: function () {
      const list = this.getItemWrapClass()
      if (this.multiple) {
        list.push('is-multiple')
      }
      return list
    },
    // 获取选项列表
    getOptions: function () {
      if (this.isFunction(this.options)) {
        return this.options(this.rowData)
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
    // 获取slot
    getSlot: function (opt) {
      if (this.isFunction(this.slot)) {
        return this.slot(this.rowData, opt)
      } else {
        return this.slot
      }
    },
    // 判断选择是否禁用
    checkOptionDisabled: function (opt) {
      if (this.isFunction(this.optionDisabled)) {
        return this.optionDisabled(opt)
      }
      if (this.isFunction(opt.disabled)) {
        return opt.disabled(this.rowData)
      } else {
        return opt.disabled
      }
      return false
    },
    // 选中值发生变化时触发
    onChange: function (value) {
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange(value, this.rowData)
      }
      if (this.isFunction(this.data.afterChange)) {
        setTimeout(() => {
          this.data.afterChange(value, this.rowData)
        }, 0)
      }
    },
    // 下拉框出现/隐藏时触发
    onVisibleChange: function (isShow) {
      if (this.isFunction(this.data.onVisibleChange)) {
        this.data.onVisibleChange({isShow})
      }
    },
    // 多选模式下移除tag时触发
    onRemoveTag: function () {

    },
    // 可清空的单选模式下用户点击清空按钮时触发
    onClear: function () {

    },
    // 当 input 失去焦点时触发
    onBlur: function () {
      if (this.isFunction(this.data.onBlur)) {
        this.data.onBlur()
      }
    },
    // 当 input 获得焦点时触发
    onFocus: async function () {
      // 加载options
      if (this.lazy && this.lazyOptions.length === 0) {
        this.loading = true
        this.lazyOptions = await this.getOptions()
        console.log(this.lazyOptions)
        this.loading = false
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
    .no-close{
      >>> .el-tag__close{
        display: none !important;
      }
    }
  }
}
</style>
