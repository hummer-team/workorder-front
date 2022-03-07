/*
*  @ 全局基础输入框组件
*  @
*/
<template>
  <div class="basic-item-wrap default-input" :class="getItemWrapClass({itemType: 'input', type})">
    <default-validate ref="validate" type="input" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData" :rows="rows"></default-validate>
    <el-input :class="noBorder ? 'no-border' : ''" v-model="innerValue" :type="type" :maxlength="maxlength" :minlength="minlength" :show-word-limit="showWordLimit" :placeholder="placeholder" :clearable="clearable" :show-password="showPassword" :disabled="getDisabled()" :prefix-icon="prefixIcon" :suffix-icon="suffixIcon" :rows="rows" :autosize="autosize" :autocomplete="autocomplete" :readonly="readonly" :max="max" :min="min" :step="step" :resize="resize" :autofocus="autofocus" @blur="onBlur" @focus="onFocus" @change="onChange" @input="onInput" @clear="onClear">
      <!--
      <template v-if="prefix" slot="prefix">
        {{prefix}}
      </template>
      <template v-if="suffix" slot="suffix">
        {{suffix}}
      </template>
      -->
      <template v-if="prepend" slot="prepend">
        {{getPrepend()}}
      </template>
      <template v-if="append" slot="append">
        {{getAppend()}}
      </template>
    </el-input>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-input',
  mixins: [basicItemMixin],
  data () {
    return {
      // text，textarea
      type: 'text',
      // 原生属性，最大输入长度
      maxlength: '',
      // 原生属性，最小输入长度
      minlength: '',
      // 是否显示输入字数统计
      showWordLimit: false,
      // 输入框占位文本
      placeholder: '请输入',
      // 是否可清空
      clearable: false,
      // 是否显示切换密码图标
      showPassword: false,
      // 禁用
      disabled: false,
      // 输入框头部图标
      prefixIcon: '',
      // 输入框尾部图标
      suffixIcon: '',
      // 输入框行数，只对 type="textarea" 有效
      rows: 2,
      // 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }
      autosize: false,
      // 原生属性，自动补全
      autocomplete: '',
      // 原生属性，是否只读
      readonly: false,
      // 原生属性，设置最大值
      max: '',
      // 原生属性，设置最小值
      min: '',
      // 原生属性，设置输入字段的合法数字间隔
      step: '',
      // 控制是否能被用户缩放
      resize: '',
      // 原生属性，自动获取焦点
      autofocus: false,
      // 输入框前置内容
      prepend: '',
      // 输入框后置内容
      append: '',
      // 是否无边框
      noBorder: false
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
      const { label, inputType, maxlength, minlength, showWordLimit, placeholder, clearable, disabled, prefixIcon, suffixIcon, rows, autocomplete, readonly, prepend, append, showPassword, noBorder } = this.data
      this.label = this.isSet(label) ? label : ''
      this.type = this.isSet(rows) && rows > 1 ? 'textarea' : 'text'
      if (inputType) {
        this.type = inputType
      }
      this.maxlength = this.isSet(maxlength) ? maxlength : ''
      this.minlength = this.isSet(minlength) ? minlength : ''
      this.showWordLimit = this.isSet(showWordLimit) ? showWordLimit : false
      this.placeholder = this.isSet(placeholder) ? placeholder : '请输入' + label
      this.clearable = this.isSet(clearable) ? clearable : false
      this.disabled = this.isSet(disabled) ? disabled : false
      this.prefixIcon = this.isSet(prefixIcon) ? prefixIcon : ''
      this.suffixIcon = this.isSet(suffixIcon) ? suffixIcon : ''
      this.rows = this.isSet(rows) ? rows : 1
      this.autocomplete = this.isSet(autocomplete) ? autocomplete : ' off'
      this.readonly = this.isSet(readonly) ? readonly : false
      this.prepend = this.isSet(prepend) ? prepend : ''
      this.append = this.isSet(append) ? append : ''
      this.showPassword = this.isSet(showPassword) ? showPassword : false
      this.noBorder = this.isSet(noBorder) ? noBorder : false

      if (this.maxlength && !placeholder) {
        this.placeholder = '请输入' + this.maxlength + '个以内字符'
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
    // 获取prepend描述
    getPrepend: function () {
      if (this.isFunction(this.prepend)) {
        return this.prepend(this.rowData)
      } else {
        return this.prepend
      }
    },
    // 获取append描述
    getAppend: function () {
      if (this.isFunction(this.append)) {
        return this.append(this.rowData)
      } else {
        return this.append
      }
    },
    // 在 Input 失去焦点时触发
    onBlur: function () {
      if (this.isFunction(this.data.onBlur)) {
        return this.data.onBlur(this.rowData, this.value)
      }
    },
    // 在 Input 获得焦点时触发
    onFocus: function () {

    },
    // 仅在输入框失去焦点或用户按下回车时触发
    onChange: function () {

    },
    // 在 Input 值改变时触发
    onInput: function () {
      if (this.isFunction(this.data.onInput)) {
        return this.data.onInput(this.rowData)
      }
    },
    // 在点击由 clearable 属性生成的清空按钮时触发
    onClear: function () {

    }
  },
  created: function () {

  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-input{
  .no-border{
    >>> .el-input__inner{
      border: none;
      background: none;
    }
  }
}
</style>
