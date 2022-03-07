/*
*  @ 全局基础图片组件 支持图片上传
*  @
*/
<template>
  <div class="basic-item-wrap default-image" v-show="getIsShow()" @dblclick="onDblclick">
    <default-validate ref="validate" type="image" :value="value" :label="isFunction(label) ? label() : label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <div class="image-box" v-if="imageUrl">
      {{alt}}
      <default-video class="default-video" v-if="imageUrl.substring(imageUrl.length - 3) === 'mp4'" :src="imageUrl" autoplay="autoplay" loop="loop"></default-video>
      <el-image v-else :src="imageUrl" :fit="fit" :alt="alt" :style="getImageStyle()" :preview-src-list="previewSrcList">
        <!--<template slot="placeholder">
          placeholder
        </template>-->
        <template slot="error">
          <div class="error">
            <img src="../../assets/images/pic-error.png" />
          </div>
        </template>
      </el-image>
      <i v-if="imageUrl && isDeleteAble" class="el-icon-close" @click="deleteImage" />
    </div>
    <span v-if="!imageUrl && !getUploadAble()">
      {{emptyText}}
    </span>
    <!-- <template v-if="getUploadShow()"> template 不支持 v-show -->
      <default-image-picker style="display: inline-block;" @image-select="handleImageSelect" v-if="selectAble" v-show="getUploadShow()">
        <img :src="uploadIcon" :style="getIconStyle()" />
      </default-image-picker>
      <default-upload class="upload-wrap" @success="onUploadBack" :maxSize="maxSize" :fileTypes="fileTypes" :upload-data="uploadData" v-if="!selectAble" v-show="getUploadShow()">
        <img :src="uploadIcon" :style="getIconStyle()" />
      </default-upload>
    <!-- </template> -->
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
import uploadIcon from '@/assets/images/add-block.svg'
export default {
  name: 'default-image',
  mixins: [basicItemMixin],
  data () {
    return {
      isShow: true,
      // 确定图片如何适应容器框 fill拉伸 / contain保持比例显示最大边 / cover保持比例显示最小边 / none / scale-down
      fit: 'cover',
      alt: '',
      // 支持大图预览
      isPreview: true,
      imageHeight: null,
      imageWidth: null,
      iconHeight: null,
      iconWidth: null,
      style: {},
      format: null,
      emptyText: null,
      // 允许上传图片
      uploadAble: false,
      // 允许选择图片
      selectAble: true,
      // 允许删除图片
      deleteAble: null,
      // 上传按钮图片
      uploadIcon: uploadIcon
    }
  },
  props: {
    // 组件值
    value: { default: '' },
    // 组件配置
    data: { type: Object, default: () => { return {} } },
    // 行数据
    rowData: { type: Object, default: null },
  },
  computed : {
    imageUrl: function () {
      let value = this.value
      if (this.format) {
        return this.format(this.rowData)
      }
      return value
    },
    previewSrcList: function () {
      if (this.isPreview) {
        return [this.imageUrl]
      }
      return []
    },
    isDeleteAble: function () {
      if (this.deleteAble === null) {
        return this.getUploadAble()
      }
      return this.deleteAble
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
      const { label, isShow, fit, alt, isPreview, imageHeight, imageWidth, iconHeight, iconWidth, style, format, emptyText, uploadAble, selectAble, deleteAble, maxSize, fileTypes, uploadData } = this.data
      this.label = this.isSet(label) ? label : ''
      this.isShow = this.isSet(isShow) ? isShow : true
      this.fit = this.isSet(fit) ? fit : 'cover'
      this.alt = this.isSet(alt) ? alt : ''
      this.isPreview = this.isSet(isPreview) ? isPreview : true
      this.imageHeight = this.isSet(imageHeight) ? imageHeight : null
      this.imageWidth = this.isSet(imageWidth) ? imageWidth : null
      this.iconHeight = this.isSet(iconHeight) ? iconHeight : null
      this.iconWidth = this.isSet(iconWidth) ? iconWidth : null
      this.style = this.isSet(style) ? style : {}
      this.format = this.isFunction(format) ? format : null
      this.emptyText = this.isSet(emptyText) ? emptyText : null
      this.uploadAble = this.isSet(uploadAble) ? uploadAble : false
      this.selectAble = this.isSet(selectAble) ? selectAble : true
      this.deleteAble = this.isSet(deleteAble) ? deleteAble : null
      this.maxSize = this.isSet(maxSize) ? maxSize : 3072
      this.fileTypes = this.isSet(fileTypes) ? fileTypes : ['jpg','png','jpeg', 'gif', 'webp', 'bmp']
      this.uploadData = this.isSet(uploadData) ? uploadData : null
    },
    // 获取图片显示状态
    getIsShow: function () {
      if (this.isFunction(this.isShow)) {
        return this.isShow()
      } else {
        return this.isShow
      }
    },
    // 获取uploadAble状态
    getUploadAble: function () {
      if (this.isFunction(this.uploadAble)) {
        return this.uploadAble(this.rowData)
      } else {
        return this.uploadAble
      }
    },
    // 获取上传按钮展示状态
    getUploadShow: function () {
      if (this.value) {
        return false
      }
      if (this.getUploadAble()) {
        return true
      }
      return false
    },
    // 获取图片style
    getImageStyle: function () {
      const style = this.jsonClone(this.style)
      if (this.imageHeight) {
        style.height = typeof (this.imageHeight) === 'number' ? this.imageHeight + 'px' : this.imageHeight
      }
      if (this.imageWidth) {
        style.width = typeof (this.imageWidth) === 'number' ? this.imageWidth + 'px' : this.imageWidth
      }
      return style
    },
    // 获取上传图标style
    getIconStyle: function () {
      const defaultHeight = this.getImageStyle().height
      const style = {
        height: defaultHeight,
        width: defaultHeight
      }
      if (this.iconHeight) {
        style.height = typeof (this.iconHeight) === 'number' ? this.iconHeight + 'px' : this.iconHeight
      }
      if (this.iconWidth) {
        style.width = typeof (this.iconWidth) === 'number' ? this.iconWidth + 'px' : this.iconWidth
      }
      return style
    },
    // 选择图片回调方法
    handleImageSelect: function (data) {
      this.onUploadBack([data])
    },
    // 上传成功回调方法
    onUploadBack: function (data) {
      const obj = data[0]
      const value = obj.url
      if (this.isFunction(this.data.onUpload)) {
        this.data.onUpload({value, apiRes: obj, rowData: this.rowData})
      }
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value, apiRes: obj, rowData: this.rowData})
      }
      this.$emit('input', value)
    },
    // 删除图片
    deleteImage: function () {
      const value = ''
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value, rowData: this.rowData})
      }
      this.$emit('input', value)
    },
    // 双击事件
    onDblclick: function () {
      if (this.isFunction(this.data.onDblclick)) {
        this.data.onDblclick(this.rowData)
      }
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.default-image{
  margin: 0 auto;
  line-height: 0;

  div.error{
    background-color: #f3f3f3;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .image-box{
    display: inline-block;
    position: relative;
    .default-video{
      width: 100px;
      height: 100px;
    }
    .el-image{
      color: #fff;
    }
    .el-icon-close{
      display: none;
      color: #fff;
      cursor: pointer;
      position: absolute;
      padding: 2px;
      background-color: rgba(0,0,0,0.5);
      top: 0;
      right: 0;
    }
    &:hover .el-icon-close{
      display: block;
    }
  }
  .upload-wrap{
    display: inline-block;
  }
}
</style>

<style lang="scss" scoped>
.default-image{
  height: auto;
  .default-validate{
    bottom: auto;
    top: -10px;
  }
}
</style>
