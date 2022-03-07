<template>
  <default-dialog ref="dialog" :title="dialog.title" :width="dialog.width" :button-list="buttonList" @close="afterDialogClose">
    <div class="operation-section" v-if="!complete">
      <div class="download-area" v-if="downloadOptions.length">
        <p class="download-title">模板下载</p>
        <div class="icon-area" v-for="(option, index) in downloadOptions" :key="index">
          <img class="download-icon" src="../../assets/images/excel.png" />
          <p class="download-text">{{option.title}}</p>
          <p class="download-button" @click="downloadTemplate(option)">点击下载</p>
        </div>
      </div>
      <div class="upload-area">
        <p class="upload-title">上传附件
          <span class="upload-text">请按照模板录入相应信息，文件不得超过3M</span>
        </p>
        <el-upload class="upload-file"
          ref="upload"
          :action="upload.url"
          :limit="upload.limit"
          :on-exceed="handleExceed"
          :data="upload.data"
          :headers="upload.headers"
          accept="upload.accept"
          name="files"
          :on-change="onChange"
          :before-upload="beforeUpload"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :auto-upload="false"
          :multiple='upload.multiple'
          >
          <el-button size="small" type="primary" plain icon="el-icon-upload2">上传文件</el-button>
          <div slot="tip" class="upload-tip">
            <span>支持扩展名: {{upload.accept}}</span>
          </div>
        </el-upload>
      </div>
    </div>
    <div class="success-section" v-else>
      <p class="success-text">文件已上传成功, 批次号为<span class="batch-text">{{batchCode}}</span>, 请前往批处理中心进行查看吧</p>
      <el-button size="small" class="success-button" type="primary" @click="handleBatch">复制批次号, 并前往批处理中心</el-button>
    </div>
  </default-dialog>
</template>

<script>
import axios from 'axios'
import { ApiConf } from '@/config'
import { copyText } from '@/utils/helper'

export default {
  data () {
    return {
      // 弹框配置信息
      dialog: {
        title: '文件导入',
        width: 600,
        fileTitle: ''
      },
      // 上传配置
      upload: {
        url: '',
        limit: 1,
        data: {},
        headers: {}
      },
      buttonList: [
        { label: '确认导入', type: 'primary', loading: () => this.formLoading, function: this.doSubmit, isShow: () => !this.complete },
        { label: '取消', loading: () => this.formLoading, function: this.closeDialog, isShow: () => !this.complete }
      ],
      // 上传是否完成
      complete: false,
      // 上传后返回的批次号
      batchCode: '',
      // 文件binary资源
      fileList: []
    }
  },
  props: {
    // dialog标题
    title: { type: String, default: '' },
    // dialog宽度
    width: { type: Number, default: 0 },
    onDialogClose: { type: Function, default: null },
    // 上传的文件个数限制
    limit: { type: Number, default: 1 },
    data: { type: Object, default: {} },
    // 模板下载配置数组
    /*
      downloadOptions: [
        {
          title: '', // 模板标题
          type: '' // 下载query参数type
        }
      ]
    */
    downloadOptions: { type: Array, default: () => { return [] } },
    // 文件上传url
    uploadUrl: { type: String, default: '' },
    // 文件上传参数
    uploadData: { type: Object, default: () => { return {} } },
    // 文件上传请求头
    uploadHeaders: { type: Object, default: () => { return {} } },
    // 文件模板下载url
    fileModelUrl: { type: String, default: '' }
  },
  computed : {},
  watch: {
    title: function (title) {
      this.dialog.title = title
    }
  },
  methods:{
    // 初始化配置参数
    dataInit: function () {
      this.dialog.title = this.title || '文件导入'
      this.dialog.width = this.width || 600
      this.dialog.fileTitle = this.fileTitle || '文件模板'
      this.upload.url = this.uploadUrl || ''
      this.upload.data = this.uploadData || {},
      this.upload.limit = this.data.uploadConfig ? this.data.uploadConfig.limit : 1
      this.upload.accept = this.data.uploadConfig ? this.data.uploadConfig.accept : '.xls,.xlsx'
      this.upload.multiple = this.data.uploadConfig ? this.data.uploadConfig.multiple : false
      this.upload.headers = this.uploadHeaders || {
        token: this.$storage.get('token'),
        siteId: localStorage.getItem('siteId')
      }
      this.upload.fileModelUrl = this.fileModelUrl || ''
    },
    // 上传文件个数超出限制触发
    handleExceed: function () {
      this.warning(`最多支持同时导入${this.upload.limit}个excel文件`)
    },
    // 文件状态改变时触发
    onChange: function (file, fileList) {
      const fileType = file.name.split('.').pop()
      if (['xls', 'xlsx', 'zip', 'rar', '7z'].indexOf(fileType.toLowerCase()) < 0) {
        this.warning('当前文件格式 【' + fileType + '】 不允许上传')
        fileList.splice(fileList.indexOf(file), 1)
      }
      const fileSize = Math.ceil(file.size / 1024)
      if (fileSize > 100 * 1024) {
        this.warning('文件大小不能超过100MB')
        fileList.splice(fileList.indexOf(file), 1)
      }
      this.fileList.push(file)
    },
    // 移除文件前触发
    beforeRemove: function (file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }?`)
      this.fileList.pop()
    },
    // 文件上传前触发
    beforeUpload: function (file, fileList) {
      if (!this.upload.url) {
        this.warning('暂未配置上传链接')
        return false
      }
    },
    // 上传成功后触发
    handleSuccess: function (response, file, fileList) {
      this.success('上传成功')
      if (response.data && response.data[0]) {
        this.batchCode = response.data[0].batchCode
      }
      this.$refs.upload.clearFiles()
      this.complete = true
    },
    // 上传失败后触发
    handleError: function (err, file, fileList) {
      this.error('上传失败')
    },
    openDialog: function () {
      this.$refs['dialog'].openDialog()
    },
    // 关闭弹框
    closeDialog: function () {
      this.$refs['dialog'].closeDialog()
    },
    // 弹框关闭之后
    afterDialogClose: function () {
      if (this.onDialogClose) {
        this.onDialogClose()
      }
      this.complete = false
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
      this.fileList = []
      setTimeout(() => {
        this.dialogDisplay = false
      }, 500)
    },
    // 复制batchCode到剪贴板并前往批处理中心
    handleBatch: function () {
      copyText(this.batchCode)
      this.closeDialog()
      this.menuOpen({ name: 'batchList' })
    },
    // 下载模板
    downloadTemplate: async function (option) {
      if (!option.type) {
        this.warning('暂未配置下载链接')
        return
      }
      let getFileUrl = '/v1/backoffice/filestore/template/download'
      if (this.upload.fileModelUrl){
        getFileUrl = this.upload.fileModelUrl
      }
      const url = getFileUrl
      await axios.get(url, { params: { type: option.type }, headers: { token: this.$storage.get('token'), siteId: localStorage.getItem('siteId') }, responseType: 'blob' }).then((res) => {
        if (res.status === 200 && res.data) {
          // const disposition = res.headers['content-disposition']
          // const fileName = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length))
          const fileName = '批量导入openId 到推送计划.xlsx'
          const blob = new Blob([res.data])
          let downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = fileName.replace(/"/g, '') // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        } else {
          this.error(res.message)
        }
      }).catch((error) => {
        if (error) {
          this.error(error.message || error.toString())
        }
      })
    },
    // 提交表单
    doSubmit: async function () {
      if (this.data.uploadConfig && this.data.uploadConfig.isuseInterFaceUploadFiles) {
        let formData = new FormData();  //  用FormData存放上传文件
        this.fileList.forEach(file => {
            formData.append('files', file.raw)
        })
        let url = '/v1/backoffice/filestore/jobmedia/upload/job?batchType=PRODUCT_CAROUSEL&service=productservice'
        if(this.upload.url){
          url = this.upload.url
        }
        console.log('aaaaa', url)
        axios({
            method: 'post',
            url: ApiConf.api + ApiConf.contentPath + ApiConf.version + url,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              token: this.$storage.get('token'),
              siteId: localStorage.getItem('siteId')
            }
          }).then(data=>{
            if (data.status === 200 && data.data && data.data.code === 20000) {
              this.success('上传成功')
              if (data.data.data && data.data.data[0]) {
                this.batchCode = data.data.data[0].batchCode
              }
              this.$refs.upload.clearFiles()
              this.complete = true
            } else {
              this.error(data.data.message)
            }
          })
        } else {
          this.$refs.upload.submit()
        }
      }
      //
  },
  created: function () {
    this.dataInit()
  },
  mounted: function () {
    this.$on('openDialog', this.openDialog)
    this.$on('closeDialog', this.$refs['dialog'].closeDialog)
  }
}
</script>

<style lang="scss" scoped>
.operation-section{
  .download-area{
    display: flex;
    font-size: 14px;
    padding-left: 50px;
    padding-top: 20px;
    padding-right: 50px;
    .download-title{
      color: #333333;
    }
    .icon-area{
      // width: 25%;
      text-align: center;
      margin-left: 20px;
      line-height: 25px;
      .download-icon{
        width: 35px;
        // height: 3%;
      }
      .download-text{
        color: #333333;
      }
      .download-button{
        cursor: pointer;
        color: #53A8FF;
      }
    }
  }
  .upload-area{
    font-size: 14px;
    padding: 20px 50px;
    .upload-title{
      color: #333333;
      .upload-text{
        margin-left: 16px;
        color: #999999;
      }
    }
    .upload-file{
      padding-top: 15px;
      .upload-tip{
        margin-top: 8px;
        color: #999999;
      }
    }
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
