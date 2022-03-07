<template>
  <div>
    <page-box :is-full="true">
      <default-form ref="search-form" form-type="search" :form-data="formData" :form-items="formItems" :form-button-list="formButtonList" :btnWrapStyle="btnWrapStyle"></default-form>
      <default-table :loading="searchLoading" :table-data="tableData" :table-items="tableItems" :showSerialNumber="true" :show-pagination="false"></default-table>
    </page-box>
    <default-dialog-form ref="form-dialog" :width="700" title="创建模板" :form-data="dialog.formData" :form-items="dialog.formItems" :form-submit="onDialogFormSubmit"></default-dialog-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'templateList',
  data() {
    return {
      searchLoading: false,
      btnWrapStyle: {
        wrapSpan: 8
      },
      formData: {
      },
      formItems: [
      ],
      tableData: [],
      tableItems: [
        { label: '模板名称', field: 'name' },
        { label: '所属项目', field: 'projectCode' },
        { label: '创建时间', field: 'createdDatetime' },
        { label: '环境', field: 'envList', format: (row) => {
          if (row.envList) {
            return row.envList.join(',')
          }
        } },
        { label: '描述', field: 'describe', type: 'table-text' }
      ],
      formButtonList: [
        { label: '刷新', type: 'primary', float: 'left', function: this.getDataList, isShow: () => this.role === 3, icon: 'refresh' },
        { label: '新建', type: 'primary', float: 'left', function: this.createTemplate, isShow: () => this.role === 3, icon: 'circle-plus-outline' }
      ],
      dialog: {
        formData: {},
        formItems: [
          { label: '项目', field: 'projectCode', type: 'select', options: () => this.projects, size: 2, validate: { isRequired: true } },
          { label: '模板名称', field: 'name', size: 2, validate: { isRequired: true } },
          { label: '审批用户', field: 'approveUserIds', type: 'select', options: () => this.approveUsers, multiple: true, size: 2, validate: { isRequired: true } },
          { label: '执行用户', field: 'executeUserId', type: 'select', options: () => this.executeUsers, size: 2 , validate: { isRequired: true }},
          { label: '描述', field: 'describe', rows: 5, size: 2 }
        ]
      },
      approveUsers: [],
      executeUsers: [],
      projects: []
    }
  },
  computed: {
    ...mapState('user', ['role', 'roleCode'])
  },
  watch: {},
  methods: {
    createTemplate: function (row) {
      this.dialog.formData = {
        projectCode: '',
        name: '',
        approveUserIds: [],
        executeUserId: '',
        describe: ''
      }
      this.openDialog('form-dialog')
    },
    initData: async function () {
      this.getDataList()
      this.getUsers()
      this.getProjects()
    },
    getUsers: async function () {
      await this.$api.query(this.$api.user.userList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          const users = res.data.map(item => {
            return {
              code: item.id,
              name: item.userName,
              roleCode: item.roleCode
            }
          })
          this.approveUsers = users.filter(item => item.roleCode === 'APPROVE')
          this.executeUsers = users.filter(item => item.roleCode === 'EXECUTE')
        }
      }, this.apiHandleError)
    },
    getProjects: async function () {
      await this.$api.query(this.$api.template.projectList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.projects = res.data.map(item => {
            return {
              code: item,
              name: item
            }
          })
        }
      }, this.apiHandleError)
    },
    getDataList: async function () {
      if (this.searchLoading === true) return
      this.searchLoading = true

      await this.$api.query(this.$api.template.templateList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.tableData = res.data
        }
      }, this.apiHandleError)
      this.searchLoading = false
    },
    closeDialog: function () {
      this.$refs['form-dialog'].closeDialog()
    },
    onDialogFormSubmit: async function (formData) {
      const data = formData
      await this.$api.query(this.$api.template.templateNew, { data }).then(({ res }) => {
        if (res.code === 0) {
          this.success('创建成功')
          this.$refs['form-dialog'].closeDialog()
          this.initData()
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
