/*
*  @ 通用文件上传组件
*  @
*/
<template>
  <div>
    <el-upload 
      name="files"
      :action="actionUrl"
      :accept="accept"
      :headers="headers"
      :data="data"
      :show-file-list="false"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
      :disabled="getDisabled()"
    >
      <slot></slot>
    </el-upload>
  </div>
</template>

<script>
import { ApiConf, ImgConf } from '@/config'
import { mapState, mapGetters } from 'vuex'

export default {
  inject: ['getModule'],
  data () {
    return {
      actionUrl: ImgConf.baseurl + '/v1/backoffice/filestore/media/upload/medias',
      headers: {
        token: this.$storage.get('token'),
        siteId: localStorage.getItem('siteId')
      },
      data: {},
      accept: 'image/png,image/gif,image/jpg,image/jpeg,image/webp,image/bmp,video/mp4,audio/mp4',
      file: {
        name: '',
        suffix: '',
        size: 0
      }
    }
  },
  props:{
    // 预定义的 folder pk 有 product/wcms/category/icon/comment/medias(未分组目录)
    folder: { type: String, default: 'medias' },
    // upload module, support: product(产品管理)/wcms(内容管理)/category(品类管理)/icon(图标)/comment(评论)/promotion(促销)/medias
    module: { type: String, default: 'medias' },
    // formats(MediaFormat,TailorMode), sample: H5_PRODUCT_MAIN,RATIO;PC_PRODUCT_MAIN,CENTER
    formats: { type: String, default: '' },
    maxSize: { type: Number, default: 3072 },
    fileTypes: { type: Array, default: () => ['jpg','png','jpeg','webp','bmp','gif','mp4'] },
    uploadData: { type: Function, default: null },
    disabled: { default: null }
  },
  computed : {},
  methods:{
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.disabled)) {
        return this.disabled()
      } else {
        return this.disabled
      }
    },
    beforeUpload: async function (file) {
      let that = this

      this.file.name = file.name
      this.file.suffix = file.name.split('.').pop()
      this.file.size = Math.ceil(file.size/1024)

      if (this.file.suffix === 'mp4') {
        if (this.file.size > 10240) {
          this.$message({
            message: '文件大小不能超过 10MB',
            type: 'error'
          })
          return false
        }
      } else {
        let maxSizeMsg = this.maxSize + ' KB'
        if (this.maxSize >= 1024) {
          maxSizeMsg = parseInt(this.maxSize/1024) + ' MB'
        }
  
        if (this.file.size > this.maxSize) {
          this.$message({
            message: '文件大小不能超过 ' + maxSizeMsg,
            type: 'error'
          })
          return false
        }
      }

      if (this.fileTypes.length) {
        if (!this.fileTypes.includes(this.file.suffix.toLowerCase())) {
          this.$message({
            message: '当前文件格式 【' + that.file.suffix + '】 不允许上传',
            type: 'error'
          });
          return false;
        }
      }

      this.getUploadData()
      await this.$nextTick()
    },
    getUploadData: function () {
      let data = {}
      if (this.isFunction(this.uploadData)) {
        data = this.uploadData()
      } else {
        data = {
          folderId: this.folder,
          formats: this.formats
        }
      }

      this.data = data

      if (this.getModule()) {
        this.actionUrl = ImgConf.baseurl + '/v1/backoffice/filestore/media/upload/' + this.getModule()
      }
    },
    onSuccess: function (data) {
      let that = this
      if (data.code === 0) {
        this.$message({
          message: '文件 【' + that.file.name + '】 上传成功',
          type: 'success'
        })
        this.$emit('success', data.data)
      } else {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '文件 【' + that.file.name + '】 上传失败' + data.msg,
          type: 'error'
        });
      }
    },
  },
  mounted: function () {
    
  }
}
</script>
<style lang="scss" scoped>

</style>
