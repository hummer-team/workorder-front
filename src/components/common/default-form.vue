/*
*  @ 全局通用表单组件
*  @
*/
<template>
  <div class="default-form" v-if="!refreshTag">
    <el-form ref="form" :inline="false" :model="formData" :label-width="style.labelWidth" :disabled="isReadOnly" @submit.native.prevent :label-position="labelPosition" :rules="rules" auto-complete="new-password">
      <el-row :gutter="style.itemGutter">
        <!-- formItem遍历 -->
        <el-col v-for="(item, key) in formItems" :key="key" :span="(isFunction(item.span) ? item.span() : item.span) || item.size * style.itemSpan">
          <el-form-item :label="getLabel(item.label)" v-if="(item.field !== refreshItemTag) && checkItemIsLoad(item)" v-show="checkItemIsShow(item)" :label-width="item.labelWidth" :prop="getItemProp(item)">
            <!-- 自定义label -->
            <template slot="label" v-if="item.label || item.type === 'block'">
              <span class="label-wrap" :class="checkItemIsRequired(item) ? 'is-required':''">
                <span v-html="getLabel(item.label)"></span>
              </span>
            </template>
            <!-- 绘制表单组件 -->
            <template v-if="item.componentName">
              <component v-bind:is="getItemComponentName(item)" v-model="formData[item.field]" :ref="'component_' + item.field" :data="item" :row-data="formData" :validate="item.validate" @change="(value) => { checkFormValidate(item.field, value) }"></component>
            </template>
            <!-- 绘制表单提示信息 -->
            <div class="item-msg" v-if="item.itemMsg">{{item.itemMsg}}</div>
          </el-form-item>
        </el-col>
        <!-- 操作按钮区域 -->
        <el-col class="btn-wrap" v-if="formButtonList.length" :span="style.btnWrapSpan">
          <default-button v-for="(button, index) in formButtonList" :key="index" :data="button"></default-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'default-form',
  components: {
  },
  data () {
    return {
      refreshTag: false,
      refreshItemTag: false,
      // 当前查询时使用的查询条件，主要供翻页方法调用
      searchData: {},
      style: {}
    }
  },
  props: {
    // 表单只读控制字段
    readOnly: {type: Boolean, default: false},
    // 表单类型 default, search
    formType: {type: String, default: 'default'},
    // 表单状态 create, edit, view
    formStatus: {type: String, default: 'create'},
    // 表单数据对象
    formData: {type: Object, default: () => { return {} }},
    // 多字段校验方法在这配置
    formValidate: {type: Array, default: () => { return [] }},
    // 表单字段配置列表
    formItems: {type: Array, default: () => { return [] }},
    // 表单样式配置对象
    formStyle: {type: Object, default: () => { return {} }},
    // 表单按钮配置列表
    formButtonList: {type: Array, default: () => { return [] }},
    // 表单样式配置对象
    btnWrapStyle: {type: Object, default: () => { return {} }},
    // 表单标签位置
    labelPosition: {type: String, default: 'right'},
    rules: {type: Object, default: () => { return {} }}
  },
  computed: {
    isReadOnly: function () {
      return this.readOnly || this.pageType === 'view'
    }
  },
  watch: {
    formData: function () {
      this.setFormDataInit()
      this.refreshForm()
    },
    formItems: function (list) {
      this.setFormItemsInit()
      this.setFormDataInit()
    },
    formStyle: function (style) {
      this.setFormStyleInit()
    }
  },
  methods: {
    // 设置表单数据字段值
    setFormDataInit: function () {
      this.formItems.forEach(item => {
        if (this.isSet(item.field) && !this.isSet(this.formData[item.field])) {
          const defaultData = this.getItemDefaultData(item)
          this.$set(this.formData, item.field, defaultData)
        }
      })
    },
    // 对表单传参 formItems 进行默认赋值、校验等初始化的操作
    setFormItemsInit: function () {
      this.formItems.forEach(item => {
        // 设置默认 type
        if (!item.type) {
          item.type = item.componentName || 'input'
        }
        // 设置默认高度【图片】
        if (item.type === 'image' || item.type === 'image-list') {
          if (!item.imageHeight) {
            item.imageHeight = 36
          }
          if (!item.imageWidth) {
            item.imageWidth = 36
          }
        }
        // 设置默认 size
        if (!item.size) {
          this.setItemDefaultSize(item)
        }
        // 配置字段对应组件
        if (!item.componentName) {
          this.setItemComponentName(item)
        }
        // 如果是查询表单
        if (this.formType === 'search') {
          if (!this.isSet(item.clearable)) {
            item.clearable = true
          }
        }
      })
    },
    // 对表单样式进行默认赋值等初始化的操作
    setFormStyleInit: function () {
      let {itemSpan, itemGutter, labelWidth} = this.formStyle
      itemSpan = this.isSet(itemSpan) ? parseInt(itemSpan) : 8
      itemGutter = this.isSet(itemGutter) ? parseInt(itemGutter) : 20
      labelWidth = this.isSet(labelWidth) ? parseInt(labelWidth) + 'px' : '90px'

      let {wrapSpan, wrapAlign} = this.btnWrapStyle
      let btnWrapSpan = this.isSet(wrapSpan) ? parseInt(wrapSpan) : 24
      let btnWrapAlign = wrapAlign || 'right'
      console.log('1231231231', btnWrapSpan)
      if (this.formButtonList.length) {
        this.formButtonList.forEach(button => {
          if (!button.float) button.float = btnWrapAlign
        })
      }

      this.style = {itemSpan, itemGutter, labelWidth, btnWrapSpan, btnWrapAlign}
    },
    // 对表单按钮进行初始化
    setFormButtonInit: function () {
      this.formButtonList.forEach(button => {
        if (button.buttonType === 'resetForm') {
          button.function = () => {
            this.resetForm()
          }
        }
      })
    },
    // 获取组件label
    getLabel: function (label) {
      if (this.isFunction(label)) {
        return label()
      } else {
        return label
      }
    },
    // 获取组件 ComponentName
    getItemComponentName: function (item) {
      this.setItemComponentName(item, this.formData)
      return item.componentName
    },
    // 获取form对象
    getForm: function () {
      return this
    },
    // 通过field获取item对象
    getItem: function (field) {
      return this.formItems.find(item => {
        return item.field === field
      }) || false
    },
    // 获取item的组件对象列表
    getItemComponentList: function () {
      return this.formItems.map(item => {
        return item.field ? this.getItemComponent(item.field) : null
      }).filter(com => com !== null && com !== undefined)
    },
    // 获取item的组件对象
    getItemComponent: function (field) {
      if (!field) return null
      return this.$refs['component_' + field] ? this.$refs['component_' + field][0] : null
    },
    // 通过field获取数据值
    getItemValue: function (field) {
      return this.isSet(this.formData[field]) ? this.formData[field] : null
    },
    // 动态获取item对象的prop
    getItemProp: function (item) {
      return item.field
    },
    // 判断表单字段是否必填
    checkItemIsRequired: function (item) {
      if (item.validate && this.isSet(item.validate.isRequired)) {
        if (this.isFunction(item.validate.isRequired)) {
          return item.validate.isRequired(this.formData)
        } else {
          return item.validate.isRequired
        }
      }
      return false
    },
    // 判断表单字段是否加载
    checkItemIsLoad: function (item) {
      if (!item.field && item.type !== 'block') {
        return false
      }
      if (typeof (item.isLoad) === 'function') {
        return item.isLoad({form: this, row: this.formData})
      }
      if (typeof (item.isLoad) === 'boolean') {
        return item.isLoad
      }
      return true
    },
    // 判断表单字段是否显示
    checkItemIsShow: function (item) {
      if (!item.field && item.type !== 'block') {
        return false
      }
      if (typeof (item.isShow) === 'function') {
        return item.isShow({form: this, row: this.formData})
      }
      if (typeof (item.isShow) === 'boolean') {
        return item.isShow
      }
      return true
    },
    // 单字段变更触发多字段校验方法
    checkFormValidate: function (field, value) {
      if (this.formValidate.length) {
        this.formValidate.forEach(line => {
          // 字段包含在内时，则触发校验方法
          if (line.fieldList.indexOf(field) >= 0) {
            // 先把每个字段本身的校验触发一遍
            line.fieldList.forEach(field => {
              this.getItemComponent(field).doValidate()
            })
            // 获取校验结果数组，成功则为空数组
            const res = line.function({row: this.formData})
            if (res.length > 0) {
              res.forEach(obj => {
                const {field, errorMsg} = obj
                this.getItemComponent(field).setValidateObjError(errorMsg)
              })
            }
          }
        })
      }
    },
    // 重置表单字段为默认值
    resetForm: function () {
      this.$refs['form'].resetFields()
    },
    // 发起表单校验
    validateForm: async function () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
      })
      let isValidate = true
      const itemComponentList = this.getItemComponentList()

      // 触发每个字段自己的校验
      for (let i in itemComponentList) {
        if (itemComponentList[i].type === 'button') {
          continue
        }
        const { isSuccess, errorMessage } = await itemComponentList[i].doValidate()
        if (isSuccess === false) {
          isValidate = false
        }
      }

      // 触发表单配置的跨字段校验
      if (this.formValidate.length) {
        this.formValidate.forEach(line => {
          // 获取校验结果数组，成功则为空数组
          const res = line.function({row: this.formData})
          if (res.length > 0) {
            res.forEach(obj => {
              const {field, errorMsg} = obj
              this.getItemComponent(field).setValidateObjError(errorMsg)
            })
            isValidate = false
          }
        })
      }

      return isValidate
    },
    // 清除表单字段校验状态
    resetValidate: function () {
      const itemComponentList = this.getItemComponentList()

      for (let i in itemComponentList) {
        itemComponentList[i].clearValidateData()
      }
    },
    // 保存当前查询条件
    saveSearchData: function (json) {
      this.searchData = this.jsonClone(json)
    },
    // 获取当前查询条件
    getSearchData: function () {
      return this.jsonClone(this.searchData)
    },
    // 重绘表单组件
    refreshItem: function (field) {
      this.refreshItemTag = field
      this.$nextTick(() => {
        this.refreshItemTag = false
      })
    },
    // 刷新表单对象【重置表单默认值】
    refreshForm: function () {
      this.refreshTag = true
      this.$nextTick(() => {
        this.refreshTag = false
      })
    },
    // 调用工具栏方法
    runToolbarFunction: function () {
      this.$refs['component_content'][0].fullfillData()
    }
  },
  created () {
    this.setFormItemsInit()
    this.setFormDataInit()
    this.setFormStyleInit()
    this.setFormButtonInit()
  },
  mounted () {
    this.$on('resetForm', this.resetForm)
    this.$on('refreshForm', this.refreshForm)
  }
}
</script>
<style lang="scss" scoped>
.default-form{
  .btn-wrap{
    line-height: 50px;
    height: 50px;
    overflow: hidden;
    .default-button{
      display: inline-block;
    }
  }
  >>> .el-form{
    .el-form-item__error{
      background: #fff;
      top: -32% !important;
      left: 16px;
    }
  }
}
</style>
