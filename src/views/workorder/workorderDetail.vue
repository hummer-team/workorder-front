<template>
  <div>
    <page-box class="page-wrap" v-loading="formLoading" :is-full="true">
      <el-steps class="step-wrap" :active="1" align-center>
        <el-step title="创建工单"></el-step>
        <el-step title="审批工单"></el-step>
        <el-step title="执行工单"></el-step>
      </el-steps>
      <!-- <page-box-title :button-list="titleButtonList"></page-box-title> -->
      <default-form v-if="refreshTag" class="form-wrap" ref="config-form" :form-data="formData" :form-items="formItems" :form-button-list="formButtonList"></default-form>
    </page-box>
  </div>
</template>

<script>
export default {
  name: 'workorderDetail',
  data() {
    return {
      refreshTag: true,
      pageType: 'create',
      formLoading: false,
      dialogLoading: false,
      formData: {
        
      },
      formItems: [
        { label: '工单类型', type: 'select', field: 'templateId', options: () => this.templates, size: 3, disabled: () => this.pageType !== 'create', validate: { isRequired: true }, afterChange: () => {
          if (this.formData.templateId) {
            const target = this.templates.find(item => item.code === this.formData.templateId)
            if (target) {
              this.formData.describe = target.describe
            }
          }
          this.refreshTag = false
          this.$nextTick(() => {
            this.refreshTag = true
          })
        } },
        { label: '环境', type: 'radio-list', field: 'environment', options: () => {
          if (this.formData.templateId) {
            const target = this.templates.find(item => item.code === this.formData.templateId)
            if (target) {
              return target.envList
            }
          }
          return [{ name: 'PROD', code: 'PROD' }, { name: 'UAT', code: 'UAT' }, { name: 'SIT', code: 'SIT' }]
        }, size: 3, validate: { isRequired: true } },
        { label: '标题', field: 'title', size: 3, validate: { isRequired: true } },
        { label: '执行时间', type: 'date-picker', pickType: 'datetime', field: 'expectDatetime', laterNow: true, size: 3, validate: { isRequired: true } },
        { label: '工单内容', type: 'editor', field: 'content', size: 3, rows: 3, inputType: 'textarea', maxlength: 120, showWordLimit: true, validate: { isRequired: true }, placeholder: () => {
          if (this.formData.templateId) {
            const target = this.templates.find(item => item.code === this.formData.templateId)
            if (target) {
              return target.describe
            }
          }
          return ''
        } },
        { label: '工单规范说明', type: 'tooltip', field: 'describe' }
      ],
      formButtonList: [
        { label: '保存', type: 'primary', function: this.createWorkorder, isShow: () => this.pageType === 'create', float: 'left', icon: 'circle-check', loading: () => this.formLoading },
        { label: '保存', type: 'primary', function: this.updateWorkorder, isShow: () => this.pageType === 'update' && this.formData.status !== 1010, float: 'left', icon: 'circle-check', loading: () => this.formLoading },
        { label: '重新发起', type: 'primary', function: this.createWorkorder, isShow: () => this.pageType === 'update' && this.formData.status === 1010, float: 'left', icon: 'circle-check', loading: () => this.formLoading }
      ],
      categories: [],
      tags: [],
      templates: []
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    refreshForm: function () {
      this.refreshTag = false
      this.$nextTick(() => {
        this.refreshTag = true
      })
    },
    initData: async function () {
      this.pageType = this.$route.query.pageType || 'create'
      this.getTemplates()
      if (this.pageType !== 'create' && this.$route.query.id) {
        this.getWorkorderDetail()
      }
    },
    // 获取工单详情
    getWorkorderDetail: async function () {
      if (this.formLoading === true) return
      this.formLoading = true

      const urlMerge = `/${this.$route.query.id}`
     
      await this.$api.query(this.$api.workorder.info, { urlMerge }).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          for (let key in res.data) {
            this.formData[key] = res.data[key]
          }
          this.refreshForm()
        } else {
          this.error(res.message)
        }
      }, this.apiHandleError)
      this.formLoading = false
    },
    setFormData: function (formData) {
      const data = this.filterEmptyFormData(formData)

      return data
    },
    createWorkorder: async function () {
      const valid = await this.$refs['config-form'].validateForm()
      if (!valid) return
      this.formLoading = true
      const data = this.setFormData(this.formData)

      await this.$api.query(this.$api.workorder.new, { data }).then(({ res }) => {
        if (res.code === 0) {
          this.success('创建成功')
          this.formLoading = false
          this.menuTurn({ code: 'workorderDetail', query: { id: res.data, pageType: 'update' } })
        }
      }, this.apiHandleError)
      this.formLoading = false
    },
    updateWorkorder: async function () {
      const valid = await this.$refs['config-form'].validateForm()
      if (!valid) return
      this.formLoading = true
      const data = this.setFormData(this.formData)

      await this.$api.query(this.$api.workorder.edit, { data }).then(({ res }) => {
        if (res.code === 0) {
          this.success('更新成功')
          this.formLoading = false
          this.getWorkorderDetail()
        }
      }, this.apiHandleError)
      this.formLoading = false
    },
    getTemplates: async function () {
      await this.$api.query(this.$api.template.templateList).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.templates = res.data.map(item => {
            return {
              code: item.id,
              name: item.name,
              envList: item.envList.map(env => {
                return {
                  code: env,
                  name: env
                }
              }),
              describe: item.describe
            }
          })
        }
      }, this.apiHandleError)
    }
  },
  created () {
    this.initData()
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
.page-wrap{
  .step-wrap{
    padding: 30px 0 10px;
  }
  >>>.default-button{
    margin-left: 90px !important;
  }
}
</style>
