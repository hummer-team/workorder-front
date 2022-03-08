<template>
  <div>
    <page-box>
      <default-form ref="search-form" form-type="search" :form-data="formData" :form-items="formItems" :form-button-list="formButtonList" :btnWrapStyle="btnWrapStyle" :form-style="formStyle"></default-form>
    </page-box>
    <page-box :is-full="true">
      <default-table :loading="searchLoading" :table-data="tableData" :table-items="tableItems" :table-page="tablePage" :table-button-list="tableButtonList" @get-data-list="getWorkorderList" :showSerialNumber="true"></default-table>
    </page-box>
    <default-dialog class="dialog" ref="form-dialog" title="工单详情" :width="1000" :button-list="dialog.buttonList">
      <page-box-title title="基本信息" :is-extend="true" :extend-tag="baseExtendTag" :onClickTag="() => onClickTag('baseExtendTag')" :is-bold="true"></page-box-title>
      <transition-box :show-tag="baseExtendTag">
        <default-form ref="base-form" :form-data="dialog.formData" :form-items="dialog.formItems"></default-form>
      </transition-box>
      <page-box-title title="处理节点" :is-extend="true" :extend-tag="nodeExtendTag" :onClickTag="() => onClickTag('nodeExtendTag')" :is-bold="true"></page-box-title>
      <transition-box :show-tag="nodeExtendTag">
        <default-timeline class="timeline" :logs="dialog.formData.logs" timestamp-field="timestamp"></default-timeline>
      </transition-box>
    </default-dialog>
    <default-dialog class="dialog" ref="reason-dialog" title="操作理由" :width="800" :button-list="reasonDialog.buttonList">
      <default-form ref="base-form" :form-data="reasonDialog.formData" :form-items="reasonDialog.formItems"></default-form>
    </default-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'workorderList',
  data() {
    return {
      formSearchLoading: false,
      searchLoading: false,
      dialogLoading: false,
      baseExtendTag: true,
      nodeExtendTag: true,
      btnWrapStyle: {
        wrapSpan: 6
      },
      formStyle: {
        labelWidth: 49
      },
      formData: {
        status: 1000
      },
      statusOptions: [
        { name: '待审批', code: 1000 },
        { name: '驳回', code: 1010 },
        { name: '审批通过', code: 1020 },
        { name: '待执行', code: 2000 },
        { name: '执行完成', code: 3000 },
        { name: '已取消', code: 5000 }
      ],
      formItems: [
        { label: '时间', type: 'date-picker', field: 'createTime', pickType: 'datetimerange', format: 'yyyy-MM-dd HH:mm', valueFormat: 'yyyy-MM-dd HH:mm:ss', defaultTime: ['00:00:00', '23:59:59'], validate: { isRequired: true }, span: 6 },
        { label: '状态', type: 'select', field: 'status', options: () => this.statusOptions, span: 4 },
        { label: '类型', type: 'select', field: 'templateId', options: () => this.templates, span: 4 },
        { label: '名称', field: 'workOrderName', span: 4 }
      ],
      tableData: [],
      tableItems: [
        { label: '项目编码', field: 'projectCode' },
        { label: '工单类型', field: 'templateName' },
        { label: '标题', field: 'title' },
        { label: '环境', field: 'environment' },
        { label: '创建时间', field: 'createdDatetime' },
        { label: '期望执行时间', field: 'expectDatetime' },
        { label: '提交人', field: 'submitUser', isShow: () => this.role !== 0 },
        { label: '处理人', field: 'handlerUserName', isShow: () => this.role === 0 },
        { label: '处理时间', field: 'handlerDateTime', isShow: () => this.role === 0 },
        { label: '状态', field: 'statusDes', format: (row) => {
          if (row.status === 1010) {
            return `<span style="padding:7px 35px;background:#e8684a;color:#ffffff;border-radius:6px;">${row.statusDes}</span>`
          } else if (row.status === 1020) {
            return `<span style="padding:7px 22px;background:#70c437;color:#ffffff;border-radius:6px;">${row.statusDes}</span>`
          } else if (row.status === 3000) {
            return `<span style="padding:7px 22px;background:#70c437;color:#ffffff;border-radius:6px;">${row.statusDes}</span>`
          } else if (row.status === 5000) {
            return `<span style="padding:7px 28px;background:#e8684a;color:#ffffff;border-radius:6px;">${row.statusDes}</span>`
          } else {
            return `<span style="padding:7px 28px;background:#606266;color:#ffffff;border-radius:6px;">${row.statusDes}</span>`
          }
        } },
        // { label: '文章摘要', field: 'shortArtical' },
      ],
      tableButtonList: [
        { label: '编辑', type: 'primary', function: this.updateWorkorder, isShow: () => [0, 3].includes(this.role) },
        { label: '处理节点', function: this.checkDetail, isShow: () => [0, 3].includes(this.role) },
        { label: '处理', function: this.checkDetail, isShow: () => [1, 2].includes(this.role)  },
        // { label: '审批', function: (row) => this.publishOrCancelWorkorder(row, 'PUBLISH'), isShow: (row) => row.status !== 'PUBLISHED' },
        // { label: '取消', function: (row) => this.publishOrCancelWorkorder(row, 'CANCEL'), isShow: (row) => row.status === 'PUBLISHED' }
      ],
      tablePage: this.getDefaultPageData(),
      formButtonList: [
        { label: '查询', type: 'primary', loading: () => this.formSearchLoading, function: this.doSearch, float: 'left', icon: 'search' },
        { label: '重置', buttonType: 'resetForm', loading: () => this.formSearchLoading, float: 'left', icon: 'refresh' },
        { label: '新建', type: 'primary', float: 'right', function: this.createWorkorder, isShow: () => [0, 3].includes(this.role), icon: 'circle-plus-outline' }
      ],
      dialog: {
        formData: {},
        formItems: [
          { label: '工单类型', field: 'templateName', type: 'text', size: 3, disabled: true },
          { label: '标题', field: 'title', type: 'text', size: 3, disabled: true },
          { label: '环境', field: 'environment', type: 'text', size: 3, disabled: true },
          { label: '期望执行时间', field: 'expectDatetime', type: 'text', size: 3, disabled: true },
          { label: '工单内容', type: 'rich-text', field: 'content', size: 3, disabled: () => true }
        ],
        tableItems: [
          { label: '状态', field: 'statusDes' },
          { label: '操作人', field: 'handlerUser' },
          { label: '创建时间', field: 'createdDatetime' },
          { label: '最近修改时间', field: 'lastModifiedDatetime' }
        ],
        buttonList: [
          { label: '关闭', function: this.closeDialog },
          { label: '审批通过', type: 'success', function: () => this.auditWorkorder(1020), isShow: () => [1, 3].includes(this.role) && this.dialog.formData.status === 1000, icon: 'circle-check' },
          { label: '驳回', type: 'warning', function: () => this.auditWorkorder(1010), isShow: () => [1, 2, 3].includes(this.role) && (this.dialog.formData.status === 1000 || this.dialog.formData.status === 2000 || this.dialog.formData.status === 1020), icon: 'circle-close' },
          { label: '执行', type: 'primary', function: () => this.auditWorkorder(3000), isShow: () => [2, 3].includes(this.role) && (this.dialog.formData.status === 2000 || this.dialog.formData.status === 1020), icon: 'circle-check' },
          { label: '取消', type: 'danger', function: this.cancelWorkorder, isShow: () => [0, 3].includes(this.role) && (this.dialog.formData.status === 1000 || this.dialog.formData.status === 1010), icon: 'remove-outline' },
        ]
      },
      reasonDialog: {
        type: '',
        formData: {},
        formItems: [
          { label: '原因', field: 'memo', rows: 5, minlength: 10, maxlength: 200, showWordLimit: true, placeholder: '请输入10个以上, 200个以内字符' },
        ],
        buttonList: [
          { label: '关闭', function: this.closeReasonDialog },
          { label: '确定', type: 'primary', function: this.submitReasonForm },
        ]
      },
      templates: []
    }
  },
  computed: {
    ...mapState('user', ['role', 'roleCode'])
  },
  watch: {},
  methods: {
    onClickTag: function (tag) {
      this[tag] = !this[tag]
    },
    updateWorkorder: function (row) {
      this.menuOpen({
        name: 'workorderDetail',
        query: {
          id: row.id,
          pageType: 'update'
        }
      })
    },
    createWorkorder: function (row) {
      this.menuOpen({
        name: 'workorderDetail',
        query: {
          pageType: 'create'
        }
      })
    },
    initData: async function () {
      this.getTemplates()
      const now = new Date()
      const nowTime = now.getTime()
      const past = new Date(nowTime - 30 * 24 * 60 * 60 * 1000)
      this.formData.createTime = [past, now]
      setTimeout(() => {
        this.doSearch()
      }, 100)
    },
    doSearch: async function () {
      const valid = await this.$refs['search-form'].validateForm()
      if (!valid) return
      let data = this.filterEmptyFormData(this.formData)
      if (data.createTime && data.createTime.length) {
        data.queryObject = {
          beginDate: data.createTime[0],
          endDate: data.createTime[1],
          status: data.status || 0,
          templateId: data.templateId || 0,
          workOrderName: data.workOrderName || null
        }
      }
      this.$refs['search-form'].saveSearchData(data)

      this.tablePage.pageNumber = 1
      this.getWorkorderList()
    },
    getWorkorderList: async function () {
      
      if (this.searchLoading === true) return
      this.searchLoading = true

      let { pageSize, pageNumber } = this.tablePage
      let data = this.$refs['search-form'].getSearchData()
      data = Object.assign({ pageSize, pageNumber }, data)
      await this.$api.query(this.$api.workorder.list, { data }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.tableData = res.data.dataItem
          this.tablePage.total = res.data.totalCount
        } else {
          this.error(res.message)
        }
      }, this.apiHandleError)
      this.searchLoading = false
    },
    checkDetail: async function (row) {
      this.searchLoading = true
      const urlMerge = `/${row.id}`
      await this.$api.query(this.$api.workorder.info, { urlMerge }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.dialog.formData = res.data
          this.dialog.formData.lastNeedHandlerFlowId = row.lastNeedHandlerFlowId
          this.dialog.formData.logs = this.dialog.formData.handlerFlows.map(item => {
            let status = ''
            let color = ''
            let icon = ''
            if (item.status === 1010) {
              status = `<span style="color:#e8684a">${item.statusDes}</span>`
              color = '#e8684a'
              icon = 'el-icon-close'
            } else if (item.status === 1020) {
              status = `<span style="color:#70c437">${item.statusDes}</span>`
              color = '#70c437'
              icon = 'el-icon-check'
            } else if (item.status === 3000) {
              status = `<span style="color:#70c437">${item.statusDes}</span>`
              color = '#70c437'
              icon = 'el-icon-check'
            } else if (item.status === 5000) {
              status = `<span style="color:#e8684a">${item.statusDes}</span>`
              color = '#e8684a'
              icon = 'el-icon-minus'
            } else {
              status = item.statusDes
              color = '#606266'
              icon = 'el-icon-more'
            }
            let content = `<div style="line-height:30px;">状态: ${status}<br>操作人: ${item.handlerUser}`
            if (item.memo) {
              content = content + `<br>备注: ${item.memo}</div>`
            } else {
              content = content + '</div>'
            }
            return {
              timestamp: item.lastModifiedDatetime,
              content,
              color,
              icon
            }
          })
        }
      }, this.apiHandleError)
      this.searchLoading = false
      this.openDialog('form-dialog')
    },
    closeDialog: function () {
      this.$refs['form-dialog'].closeDialog()
    },
    auditWorkorder: async function (status) {
      if (status === 1010) {
        this.reasonDialog.type = 'reject'
        this.openDialog('reason-dialog')
        return
      }
      const data = {
        flowId: this.dialog.formData.lastNeedHandlerFlowId,
        status: status,
        workOrderId: this.dialog.formData.id
      }
      await this.$api.query(this.$api.workorder.flowHandler, { data }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.success('操作成功')
          this.closeDialog()
          this.getWorkorderList()
        }
      }, this.apiHandleError)
    },
    cancelWorkorder: function () {
      this.reasonDialog.type = 'cancel'
      this.openDialog('reason-dialog')
    },
    closeReasonDialog: function () {
      this.$refs['reason-dialog'].closeDialog()
    },
    submitReasonForm: async function () {
      if (this.reasonDialog.type === 'reject') {
        const data = {
          flowId: this.dialog.formData.lastNeedHandlerFlowId,
          status: 1010,
          memo: this.reasonDialog.formData.memo,
          workOrderId: this.dialog.formData.id
        }
        await this.$api.query(this.$api.workorder.flowHandler, { data }).then(({ res }) => {
          if (this.checkApiSuccess(res)) {
            this.success('驳回成功')
            this.closeReasonDialog()
            this.closeDialog()
            this.getWorkorderList()
          }
        }, this.apiHandleError)
      } else if (this.reasonDialog.type === 'cancel') {
        const data = {
          reason: this.reasonDialog.formData.memo,
          workOrderId: this.dialog.formData.id
        }
        await this.$api.query(this.$api.workorder.cancel, { data }).then(({ res }) => {
          if (this.checkApiSuccess(res)) {
            this.success('取消成功')
            this.closeReasonDialog()
            this.closeDialog()
            this.getWorkorderList()
          }
        }, this.apiHandleError)
      }
    },
    getTemplates: async function () {
      await this.$api.query(this.$api.template.templateList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.templates = res.data.map(item => {
            return {
              code: item.id,
              name: item.name,
            }
          })
        }
      }, this.apiHandleError)
    }
  },
  created () {
  },
  mounted () {
    this.initData()
  }
};
</script>

<style lang="scss" scoped>
.timeline{
  padding: 20px 50px;
}
</style>
