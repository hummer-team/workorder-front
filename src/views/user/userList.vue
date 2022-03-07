<template>
  <div>
    <page-box :is-full="true">
      <default-form ref="search-form" form-type="search" :form-data="formData" :form-items="formItems" :form-button-list="formButtonList" :btnWrapStyle="btnWrapStyle"></default-form>
      <default-table :loading="searchLoading" :table-data="tableData" :table-items="tableItems" :showSerialNumber="true" :show-pagination="false"></default-table>
    </page-box>
    <default-dialog-form ref="form-dialog" :width="700" title="创建用户" :form-data="dialog.formData" :form-items="dialog.formItems" :form-submit="onDialogFormSubmit" :rules="rules"></default-dialog-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'userList',
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
        { label: '用户名', field: 'userName' },
        { label: '角色', field: 'roleCode' },
        { label: '创建时间', field: 'createdDatetime' },
      ],
      formButtonList: [
        { label: '刷新', type: 'primary', float: 'left', function: this.getDataList, icon: 'refresh' },
        { label: '新建', type: 'primary', float: 'left', function: this.createUser, icon: 'circle-plus-outline' }
      ],
      dialog: {
        formData: {},
        formItems: [
          { label: '用户名', field: 'userName', size: 2, validate: { isRequired: true } },
          { label: '密码', field: 'password', showPassword: true, size: 2, validate: { isRequired: true } },
          { label: '确认密码', field: 'confirmPassword', showPassword: true, size: 2, validate: { isRequired: true } },
          { label: '角色', field: 'roleCode', type: 'select', options: () => this.roles, size: 2 , validate: { isRequired: true }},
          { label: '工单类型', field: 'templateIds', type: 'select', multiple: true, options: () => this.templates, optionCode: 'id', size: 2, validate: { isRequired: true }, isLoad: ({ row }) => row.roleCode === 'DEVELOP' }
        ]
      },
      roles: [],
      templates: [],
      rules: {
        confirmPassword: [
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapState('user', ['role', 'roleCode'])
  },
  watch: {},
  methods: {
    validateConfirmPassword: function (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.dialog.formData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    createUser: function (row) {
      this.dialog.formData = {
        userName: '',
        password: '',
        confirmPassword: '',
        roleCode: '',
        templateIds: []
      }
      this.openDialog('form-dialog')
    },
    initData: async function () {
      this.getDataList()
      this.getRoles()
      this.getTemplates()
    },
    getDataList: async function () {
      if (this.searchLoading === true) return
      this.searchLoading = true

      await this.$api.query(this.$api.user.userList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.tableData = res.data
        }
      }, this.apiHandleError)
      this.searchLoading = false
    },
    closeDialog: function () {
      this.$refs['form-dialog'].closeDialog()
    },
    getRoles: async function () {
      await this.$api.query(this.$api.user.roleList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.roles = res.data.map(item => {
            return {
              name: item,
              code: item
            }
          })
        }
      }, this.apiHandleError)
    },
    getTemplates: async function () {
      await this.$api.query(this.$api.template.templateList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.templates = res.data
        }
      }, this.apiHandleError)
    },
    onDialogFormSubmit: async function (formData) {
      const data = formData
      await this.$api.query(this.$api.user.userNew, { data }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
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
