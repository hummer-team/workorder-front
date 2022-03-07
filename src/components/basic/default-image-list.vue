/*
*  @ 全局基础图片列表组件 支持图片上传
*  @
*/
<template>
  <div class="default-image-list" v-show="getIsShow()">
    <draggable :list="innerValue" :animation="150" :no-transition-on-drag="true" filter=".image-picker, .upload-wrap" style="display:inline-block">
      <transition-group type="transition" :css="true">
        <div class="image-box" v-for="(imageUrl, index) in innerValue" :key="'key_'+index">
          <el-image v-if="imageUrl" :src="imageUrl" :style="getImageStyle()" :preview-src-list="[imageUrl]">
            <template slot="error">
              <div class="error">
                <img src="../../assets/images/pic-error.png" />
              </div>
            </template>
          </el-image>
          <i v-if="isDeleteAble" class="el-icon-close" @click="deleteImage(index)" />
        </div>
        <template v-if="isUploadAble">
          <default-image-picker class="image-picker" style="display: inline-block;" @image-select="handleImageSelect" :multiple="true" v-if="selectAble" key="image-picker">
            <img :src="uploadIcon" :style="getIconStyle()"/>
          </default-image-picker>
          <default-upload class="upload-wrap" @success="onUploadBack" :max-size="maxSize" :file-types="fileTypes" :upload-data="uploadData" v-else key="upload-wrap">
            <img :src="uploadIcon" :style="getIconStyle()" />
          </default-upload>
        </template>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
import draggable from 'vuedraggable'
import uploadIcon from '@/assets/images/add-block.svg'
export default {
  name: 'default-image-list',
  mixins: [basicItemMixin],
  components: {draggable},
  data () {
    return {
      isShow: true,
      minLength: 0,
      maxLength: 0,
      // 确定图片如何适应容器框 fill拉伸 / contain保持比例显示最大边 / cover保持比例显示最小边 / none / scale-down
      fit: 'cover',
      imageHeight: null,
      imageWidth: null,
      iconHeight: null,
      iconWidth: null,
      style: {},
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
    isUploadAble: function () {
      if (this.maxLength && this.innerValue.length >= this.maxLength) return false
      return this.getUploadAble()
    },
    isDeleteAble: function () {
      if (this.minLength && this.innerValue.length <= this.minLength) return false
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
      const { label, isShow, minLength, maxLength, fit, imageHeight, imageWidth, iconHeight, iconWidth, style, emptyText, uploadAble, selectAble, deleteAble, folder, uploadModule, formats, maxSize, fileTypes, uploadData } = this.data
      this.label = this.isSet(label) ? label : ''
      this.isShow = this.isSet(isShow) ? isShow : true
      this.minLength = this.isSet(minLength) ? minLength : 0 
      this.maxLength = this.isSet(maxLength) ? maxLength : 0 
      this.fit = this.isSet(fit) ? fit : 'cover'
      this.imageHeight = this.isSet(imageHeight) ? imageHeight : null
      this.imageWidth = this.isSet(imageWidth) ? imageWidth : null
      this.iconHeight = this.isSet(iconHeight) ? iconHeight : null
      this.iconWidth = this.isSet(iconWidth) ? iconWidth : null
      this.style = this.isSet(style) ? style : {}
      this.emptyText = this.isSet(emptyText) ? emptyText : null
      this.uploadAble = this.isSet(uploadAble) ? uploadAble : false
      this.selectAble = this.isSet(selectAble) ? selectAble : true
      this.deleteAble = this.isSet(deleteAble) ? deleteAble : null
      this.maxSize = this.isSet(maxSize) ? maxSize : 3072
      this.fileTypes = this.isSet(fileTypes) ? fileTypes : ['jpg','png','jpeg', 'gif', 'webp', 'bmp']
      this.uploadData = this.isFunction(uploadData) ? uploadData : null
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
      this.onUploadBack(data)
    },
    // 上传成功回调方法
    onUploadBack: function (data = []) {
      data.forEach(obj => {
        if (this.maxLength && this.innerValue.length < this.maxLength) {
          this.innerValue.push(obj.url)
        }
        if (this.isFunction(this.data.onUpload)) {
          this.data.onUpload({apiRes: obj, rowData: this.rowData})
        }
      })
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value: this.innerValue, apiRes: data, rowData: this.rowData})
      }
      // this.$emit('input', obj.url)
    },
    // 删除图片
    deleteImage: function (index) {
      this.innerValue.splice(index, 1)
      if (this.isFunction(this.data.onChange)) {
        this.data.onChange({value: this.innerValue, rowData: this.rowData})
      }
      // this.$emit('input', '')
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.default-image-list{
  display: flex;
  margin: 0 auto;
  line-height: 0;

  div.error{
    background-color: #f3f3f3;
  }
  .image-box{
    display: inline-block;
    position: relative;
    margin-right: 5px;
    margin-bottom: 5px;
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
