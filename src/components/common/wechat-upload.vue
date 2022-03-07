/*
*  @ 通用文件上传组件
*  @
*/
<template>
  <div>
    <el-upload 
      name="upload"
      :action="actionUrl"
      :accept="accept"
      :headers="headers"
      :show-file-list="false"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
      :disabled="getDisabled()"
    >
      <el-input v-model="value" style="width: 928px;" :readonly="true"></el-input>
    </el-upload>
  </div>
</template>

<script>
import { ApiConf, ImgConf } from '@/config'
import { mapState, mapGetters } from 'vuex'
import basicItemMixin from '../basic/basic-item-mixin'
import uploadIcon from '@/assets/images/add-block.svg'

export default {
  mixins: [basicItemMixin],
  data () {
    return {
      actionUrl: ImgConf.baseurl + '/backoffice/v1/promotionservice/promotion/wxmerchantuploadImageStocks',
      headers: {
        token: this.$storage.get('token'),
        siteId: localStorage.getItem('siteId')
      },
      accept: 'image/png,image/jpg,image/jpeg',
      file: {
        name: '',
        suffix: '',
        size: 0
      },
      // 上传按钮图片
      uploadIcon: uploadIcon
    }
  },
  props: {
    maxSize: { type: Number, default: 1024 },
    fileTypes: { type: Array, default: () => ['jpg','png','jpeg'] },
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

      if (this.fileTypes.length) {
        if (!this.fileTypes.includes(this.file.suffix.toLowerCase())) {
          this.$message({
            message: '当前文件格式 【' + that.file.suffix + '】 不允许上传',
            type: 'error'
          });
          return false;
        }
      }

      await this.$nextTick()
    },
    onSuccess: function (data) {
      let that = this
      if (data.code === 20000) {
        this.$message({
          message: '文件 【' + that.file.name + '】 上传成功',
          type: 'success'
        })
        const obj = data.message
        const value = data.message
        this.$emit('input', value)
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
img {
  width: 50px;
  height: 50px;
}
</style>
