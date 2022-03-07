/*
*  @ 全局基础按钮组件
*  @
*/
<template>
  <div class="default-button" v-show="getIsShow()" :style="wrapStyle">
    <!-- 正常按钮 -->
    <el-button v-if="isNormal" :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()" :disabled="getDisabled()" @click="handleClick()">
      {{getMessage()}}
    </el-button>
    <!-- popover按钮 -->
    <el-popover v-if="isPopover" :placement="popover.placement" :width="popover.width" :trigger="popover.trigger" :title="popover.title" :content="popover.content" @show="onPopoverShow" @hide="onPopoverHide">
      <component ref="popover-component" v-if="Boolean(popover.component)" :row-data="this.rowData" :data="popover.data" :is="'button-popover-' + popover.component"></component>
      <el-button slot="reference" :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()">
        {{getMessage()}}
      </el-button>
    </el-popover>
    <!-- 下拉按钮 -->
    <el-dropdown v-if="isDropdown" :placement="dropdown.placement" :trigger="dropdown.trigger" @command="handleCommand">
      <el-button :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()" :disabled="getDisabled()">
        {{getMessage()}}
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="opt in getOptions()" :key="opt.code" :command="opt.code" :disabled="checkOptionDisabled(opt)">{{opt.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 文件上传按钮 -->
    <default-upload v-if="isUpload" class="upload-wrap" @success="onUploadBack" :maxSize="maxSize" :fileTypes="fileTypes" :disabled="getDisabled" :upload-data="uploadData">
      <el-button :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()">
        {{getMessage()}}
      </el-button>
    </default-upload>
    <!-- excel导入按钮 -->
    <el-button v-if="isImport" :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()" :disabled="getDisabled()" @click="handleImport()">
      {{getMessage()}}
    </el-button>
    <!-- 日志按钮 -->
    <el-button v-if="isLog" :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()" :disabled="getDisabled()" @click="handleLog()">
      {{getMessage()}}
    </el-button>
    <!-- 导出按钮 -->
    <el-button v-if="isExport" :icon="icon" :type="type" :plain="plain" :round="round" :circle="circle" :loading="getLoading()" :disabled="getDisabled()" @click="handleExport()">
      {{getMessage()}}
    </el-button>
    <!-- 导入弹窗 -->
    <default-dialog-import ref="dialog" v-if="isImport" :title="upload.title" :width="upload.width" :limit="upload.limit" :uploadUrl="upload.uploadUrl" :fileModelUrl="upload.fileModelUrl" :uploadData="upload.uploadData" :uploadHeaders="upload.uploadHeaders" :downloadOptions="upload.downloadOptions" :onDialogClose="upload.onDialogClose" :data=data></default-dialog-import>
    <!-- 日志抽屉 -->
    <default-drawer ref="drawer" v-if="isLog" :title="log.title" :direction="log.direction" :showClose="log.showClose" :modal="log.modal" :size="log.size" :wrapperCloseable="log.wrapperCloseable" :withHeader="log.withHeader" :appendToBody="log.appendToBody" :destroyOnClose="log.destroyOnClose" :function="log.function" :lazy="log.lazy" :logs="log.logs" :timestampField="log.timestampField" :hideTimestamp="log.hideTimestamp" :placement="log.placement" :timestampType="log.timestampType" :timestampSize="log.timestampSize" :cardShadow="log.cardShadow" :cardBodyStyle="log.cardBodyStyle" :showDetail="log.showDetail"></default-drawer>
    <!-- 导出成功弹窗 -->
    <default-dialog v-if="isExport" ref="dialog" :title="exportOption.title" :width="width">
      <div class="success-section">
        <p class="success-text">文件导出成功, 批次号为<span class="batch-text">{{batchCode}}</span>, 请前往批处理中心进行查看吧</p>
        <el-button size="small" class="success-button" type="primary" @click="handleBatch">复制批次号, 并前往批处理中心</el-button>
      </div>
    </default-dialog>
  </div>
</template>

<script>
import { mapState,mapGetters,mapActions } from 'vuex'
import { copyText } from '@/utils/helper'
// 加载所有组件popover自定义样式组件
import * as popoverComponents from '@/components/business/button-popover'

export default {
  name: 'default-button',
  components: {...popoverComponents},
  data () {
    return {
      label: '按钮',
      // 是否为文件上传按钮
      isUpload: false,
      // 是否为Popover按钮
      isPopover: false,
      options: [],
      dictionary: '',
      format: null,
      filters: [],
      isShow: true,
      icon: '',
      type: '',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      // dropdown配置参数
      dropdown: {},
      // popover配置参数
      popover: {},
      // 文件上传配置参数
      maxSize: 3072,
      fileTypes: ['jpg','png','jpeg', 'gif', 'webp', 'bmp', 'mp4'],
      // 是否导入excel按钮
      isImport: false,
      // excel上传配置参数
      upload: {
        title: '',
        width: null,
        limit: 1,
        uploadUrl: '',
        uploadData: null,
        uploadHeaders: null,
        downloadOptions: null,
        onDialogClose: null,
        fileModelUrl:''
      },
      // 导出配置参数
      exportOption: {
        title: '',
        batchType: '',
        exportFields: '',
        exportQueryCondition: '',
        service: ''
      },
      // 是否日志按钮
      isLog: false,
      // 是否导出按钮
      isExport: false,
      // 日志数据
      log: {},
      width: 600,
      batchCode: ''
    }
  },
  props: {
    // 组件值
    value: { default: '' },
    // 组件配置
    data: { type: Object, default: () => { return {} } },
    // 行数据
    rowData: { type: Object, default: null }
  },
  computed : {
    ...mapGetters('user', ['authortityFlatterList']),
    // 判断是否普通按钮
    isNormal: function () {
      return !this.isDropdown && !this.isUpload && !this.isPopover && !this.isImport && !this.isLog && !this.isExport
    },
    // 判断是否下拉按钮
    isDropdown: function () {
      return this.getOptions().length > 1
    },
    wrapStyle: function () {
      let style = {}
      if (this.float === 'left') {
        style.float = 'left'
        style.marginLeft = '0px'
        style.marginRight = '10px'
      } else if (this.float === 'right') {
        style.float = 'right'
        style.marginLeft = '10px'
      }
      return style
    }
  },
  watch: {
    data: function () {
      this.dataInit()
    }
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { menuCode, label, isUpload, isPopover, uploadData, options, dictionary, format, filter, isShow, icon, type, plain, round, circle, loading, disabled, float, dropdown, popover, isImport, isLog, log, isExport } = this.data
      this.menuCode = this.isSet(menuCode) ? menuCode : ''
      this.label = this.isSet(label) ? label : '按钮'
      this.isUpload = this.isSet(isUpload) ? isUpload : false
      this.isPopover = this.isSet(isPopover) ? isPopover : false
      this.uploadData = this.isSet(uploadData) ? uploadData : null
      this.options = this.isSet(options) ? options : []
      this.dictionary = this.isSet(dictionary) ? dictionary : ''
      this.format = this.isFunction(format) ? format : null
      this.filters = this.isSet(filter) ? (this.isArray(filter) ? filter : [filter]) : []
      this.isShow = this.isSet(isShow) ? isShow : true
      this.icon = this.isSet(icon) ? 'el-icon-' + icon : ''
      this.type = this.isSet(type) ? type : ''
      this.plain = this.isSet(plain) ? plain : false
      this.round = this.isSet(round) ? round : false
      this.circle = this.isSet(circle) ? circle : false
      this.loading = this.isSet(loading) ? loading : false
      this.disabled = this.isSet(disabled) ? disabled : false
      this.float = this.isSet(float) ? float : ''
      this.dropdown = this.isSet(dropdown) ? dropdown : {}
      this.popover = this.isSet(popover) ? popover : {}
      this.isImport = this.isSet(isImport) ? isImport : false
      this.isLog = this.isSet(isLog) ? isLog : false
      this.log = this.isSet(log) ? log : {}
      this.isExport = this.isSet(isExport) ? isExport : false
      if (this.isImport) {
        const { title, width, limit, uploadUrl, uploadData, uploadHeaders, downloadOptions, onDialogClose ,fileModelUrl } = this.data
        this.upload.title = this.isSet(title) ? title : ''
        this.upload.width = this.isSet(width) ? width : null
        this.upload.limit = this.isSet(limit) ? limit : null
        this.upload.uploadUrl = this.isSet(uploadUrl) ? uploadUrl : ''
        this.upload.uploadData = this.isSet(uploadData) ? uploadData : null
        this.upload.uploadHeaders = this.isSet(uploadHeaders) ? uploadHeaders : null
        this.upload.downloadOptions = this.isSet(downloadOptions) ? downloadOptions : null
        this.upload.onDialogClose = this.isSet(onDialogClose) ? onDialogClose : null
        this.upload.fileModelUrl = this.isSet(fileModelUrl) ? fileModelUrl : ''
      }
      if (this.isExport) {
        const { title, batchType, exportFields, exportQueryCondition, service } = this.data
        this.exportOption.title = this.isSet(title) ? title : ''
        this.exportOption.batchType = this.isSet(batchType) ? batchType : ''
        this.exportOption.exportFields = this.isSet(exportFields) ? exportFields : ''
        this.exportOption.service = this.isSet(service) ? service : ''
      }
      if (this.isDropdown) {
        if (!this.dropdown.trigger) {
          this.dropdown.trigger = 'click'
        }
      }
    },
    // 获取按钮显示内容
    getMessage: function () {
      let value = this.value || this.label
      if (!this.value) {
        if (this.isFunction(this.label)) {
          value = this.label(this.rowData)
        } else {
          value = this.label
        }
      }
      if (this.dictionary) {
        return this.getDictionaryName(this.dictionary, this.value)
      }
      if (this.format) {
        return this.format(this.rowData)
      }
      if (this.filters.length) {
        this.filters.map(filter => {
          const func = Vue.filter(filter)
          if (func) {
            value = func(value)
          }
        })
      }
      return value
    },
    // 获取按钮显示状态
    getIsShow: function () {
      let authorityCodeList = this.authortityFlatterList && this.authortityFlatterList.filter(r => r.type === 2).map(r => r.code) // 权限按钮组
      // console.log(this.label, this.menuCode)
      if (this.menuCode && this.authortityFlatterList && !authorityCodeList.includes(this.menuCode)) {
        return false
      }
      if (this.isFunction(this.isShow)) {
        return this.isShow(this.rowData)
      } else {
        return this.isShow
      }
    },
    // 获取load状态
    getLoading: function () {
      if (this.isFunction(this.loading)) {
        return this.loading()
      } else {
        return this.loading
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
    // 按钮点击事件
    handleClick: function () {
      if (this.data.function && this.isFunction(this.data.function)) {
        this.data.function(this.rowData)
      }
    },
    // 导入按钮点击事件
    handleImport: function () {
      this.$refs['dialog'].openDialog()
    },
    // 日志按钮点击事件
    handleLog: async function () {
      this.$refs['drawer'].openDrawer()
      // 日志懒加载
      // if (this.data.log && this.data.log.function && this.isFunction(this.data.log.function)) {
      //   this.$refs['drawer'].startLoading()
      //   await this.data.log.function()
      //   this.$refs['drawer'].endLoading()
      // }
    },
    handleExport: async function () {
      if (this.isFunction(this.data.exportQueryCondition)) {
        this.exportOption.exportQueryCondition = JSON.stringify(this.data.exportQueryCondition())
      }
      const data = this.filterEmptyFormData(this.exportOption)
      delete data.title
      this.$api.query(this.$api.file.exportFile, { data }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.batchCode = res.data && res.data[0] ? res.data[0].batchCode : ''
          this.$refs['dialog'].openDialog()
        } else {

        }
      }, this.apiHandleError)
    },
    // 获取选项列表
    getOptions: function () {
      if (this.isFunction(this.options)) {
        return this.options(this.rowData)
      } else {
        return this.options
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
    // 处理下拉菜单点击事件
    handleCommand: function (command) {
      const opt = this.options.find(opt => opt.code === command)
      if (this.isFunction(opt.function)) {
        opt.function(this.rowData)
      }
    },
    // 上传成功回调方法
    onUploadBack: function (data) {
      const obj = data[0]
      const value = obj.url

      if (this.data.onSuccess) {
        this.data.onSuccess({value, apiRes: obj})
      }
    },
    // 复制batchCode到剪贴板并前往批处理中心
    handleBatch: function () {
      copyText(this.batchCode)
      this.$refs['dialog'].closeDialog()
      this.menuOpen({ name: 'batchManagement' })
    },
    // popover显示时触发方法
    onPopoverShow: function () {
      if (Boolean(this.popover.component)) {
        const obj = this.$refs['popover-component']
        if (this.isFunction(obj.onShow)) {
          obj.onShow()
        }
      }
    },
    // popover隐藏时触发方法
    onPopoverHide: function () {
      if (Boolean(this.popover.component)) {
        const obj = this.$refs['popover-component']
        if (this.isFunction(obj.onHide)) {
          obj.onHide()
        }
      }
    }
  },
  created: function (){
    this.dataInit()
  },
  mounted: function () {

  }
}
</script>

<style lang="scss" scoped>
.default-button{
  .el-button{
    height: $button-height;
    line-height: $button-height - 2px;
    border-radius: $button-border-radius;
    font-size: $button-font-size;
    min-width: $button-min-width;
    padding: $button-padding;
  }
  .el-button.el-button--primary.is-plain{
    color: $color;
    border-color: $color;
    background-color: #fff;
    &:hover{
      background-color: #fff8e6;
      color: $color;
    }
  }
  .upload-wrap{
    display: inline-block;
  }
}
.success-section{
  height: 250px;
  text-align: center;
  .success-text{
    font-size: 16px;
    padding-top: 100px;
    padding-bottom: 95px;
    .batch-text{
      color: #FFB600;
    }
  }
  .success-button{
  }
}
</style>
