/*
*  @ 全局基础图片选择组件 支持图片上传
*  @
*/
<template>
  <div class="default-image-picker">
    <div class="image-picker-wraper" @click="openDialog">
      <slot></slot>
    </div>
    <default-dialog ref="dialog" :title="dialog.title" :width="dialog.width" :button-list="buttonList" @close="afterDialogClose" v-if="loadDialog">
      <div class="dialog-picker-wrap">
        <!-- 左侧文件夹树结构区 -->
        <div class="left-menu" v-loading="treeFolderLoading">
          <el-scrollbar>
            <el-tree
              class="treeFolder"
              ref="treeFolder"
              :data="treeFolderData"
              :props="treeFolderProps"
              :load="treeFolderOpen"
              :current-node-key="currentKey"
              :default-expanded-keys="expandKeys"
              lazy
              node-key="pk"
              @node-click="getFolderImageList"
              highlight-current
            ></el-tree>
          </el-scrollbar>
        </div>
        <!-- 右侧图片列表区 -->
        <div class="right-wrap" v-loading="imageListLoading">
          <div v-if="!treeFolderSelPk" class="msg">
          <!-- <div v-if="!selFolderId" class="msg"> -->
            <div>请选择左侧文件夹</div>
          </div>
          <div v-else-if="imageListData.length === 0" class="msg">
            <div>当前文件夹没有图片</div>
          </div>
          <div v-else>
            <div class="image-list">
              <div class="image-wrap" v-for="image in imageListData" :key="image.pk">
                <div class="image-box" :class="getImageBoxClass(image)" @click="handImageClick(image)">
                  <i class="el-icon-check"></i>
                  <default-video class="default-video" v-if="image.url.substring(image.url.length - 3) === 'mp4'" :src="image.url" autoplay="autoplay" loop="loop"></default-video>
                  <el-image v-else :src="image.url" fit="contain" :title="image.displayName" />
                </div>
                <span>{{image.displayName}}</span>
              </div>
            </div>
            <!-- 页码组件 -->
            <el-dropdown class="sort-list" @command="handleCommand" trigger="click">
              <span class="el-dropdown-link">
                {{currentSort.name ? currentSort.name : '请选择排序方式'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command='sortItem'
                v-for="(sortItem, idx) in sortList"
                :key="idx"
                >{{sortItem.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-pagination @current-change="imageListIndexChange" :current-page="imagePageNo" :page-size="imagePageSize" layout="total, prev, pager, next, jumper" :total="imageTotal" :pager-count="5">
            </el-pagination>
          </div>
        </div>
      </div>
    </default-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'default-image-picker',
  data () {
    return {
      siteId: localStorage.getItem('siteId'),
      // 弹框配置信息
      dialog: {
        title: '图片选择',
        width: 1000
      },
      buttonList: [
        {
          label: () => {
            return this.treeFolderSelPk && this.treeFolderSelPk !== 'medias' ? '上传至当前目录':'上传至未分组图片'
            // return this.selFolderId && this.selFolderId !== 'medias' ? '上传至当前目录' : '上传至未分组图片'
          },
          type: 'primary',
          float: 'left',
          isUpload: true,
          uploadData: () => {
            return {
              folderId: this.treeFolderSelPk || 'medias',
              // folderId: this.selFolderId || 'medias',
              formats: '',
              multiple: true
            }
          },
          onSuccess: (data) => {
            this.imagePageNo = 1
            this.getFolderImageList()
          }
        },
        // {label: '删除目录', float: 'left', isShow: () => this.treeFolderSelPk, function: this.deleteFolder},
        {label: '取消', function: this.closeDialog},
        {
          label: () => {
            const length = this.imageSelectList.length
            return length > 0 ? '确认所选图片('+length+'张)' : '确认所选图片'
          },
          type: 'primary',
          function: this.onImageSelect,
          isShow: () => this.multiple === true
        }
      ],
      treeFolderSelPk: '',
      treeFolderLoading: false,
      treeFolderProps: {
        children: "subFolders",
        label: "name",
        value: "pk"
      },
      // 左侧文件夹树数据
      treeFolderData: [],
      // 已选中图片列表
      imageSelectList: [],
      imagePageNo: 1,
      imagePageSize: 15,
      imageTotal: 0,
      imageListLoading: false,
      // 当前页面图片列表
      imageListData: [],
      // 默认展开的节点keys数组
      expandKeys: [],
      // 当前选中的节点key
      currentKey: 'medias',
      treeSelNode: null,
      // 是否加载image-picker
      loadDialog: false,
      // 排序配置
      sortList: [
        { name: '更新时间由旧到新', sort: 'asc', field: 'updateTime' },
        { name: '更新时间由新到旧', sort: 'desc', field: 'updateTime' },
        { name: '文件名称由A到Z', sort: 'asc', field: 'displayName' },
        { name: '文件名称由Z到A', sort: 'desc', field: 'displayName' },
        { name: '文件大小由大到小', sort: 'desc', field: 'size' },
        { name: '文件大小由小到大', sort: 'asc', field: 'size' },
      ],
      currentSort: {
        name: ''
      },
      sortParams: null
    }
  },
  props: {
    multiple: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('image', ['selFolderId', 'selNode'])
  },
  watch: {},
  methods: {
    ...mapActions('image', ['setSelFolderId', 'setSelNode']),
    // 初始化配置参数
    dataInit: function () {
      this.treeFolderSelPk = this.selFolderId || 'medias'
      this.treeSelNode = this.selNode || null
      this.expandKeys = this.getSelKeys()
      this.currentKey = this.selFolderId || 'medias'
    },
    // 获取当前选中节点及其所有父节点的key
    getSelKeys: function () {
      const expandKeys = []
      const node = this.selNode || null
      return this.getAllKeys(this.selNode, expandKeys)
    },
    // 递归获取所有节点key
    getAllKeys: function (node, expandKeys) {
      if (node && node.key) {
        expandKeys.push(node.key)
        if (node.parent) {
          const parentNode = node.parent
          if (parentNode.key) {
            return this.getAllKeys(parentNode, expandKeys)
          } else {
            return expandKeys
          }
        } else {
          return expandKeys
        }
      } else {
        return expandKeys
      } 
    },
    // 删除文件夹
    /*
    deleteFolder: async function () {
      this.treeFolderLoading = true
      const pk = this.treeFolderSelPk
      await this.$api.query(this.$api.file.deleteFolder, {urlMerge: '/'+pk}).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.getTreeMainData()
        }
      }, this.apiHandleError)
      this.treeFolderLoading = false
    },
    */
    // 获取一级文件夹列表
    getTreeMainData: async function () {
      this.treeFolderLoading = true
      const data = {}
      await this.$api.query(this.$api.file.fileList, {data}).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          let folders = res.data.subFolders
          // 过滤未分组文件夹
          folders = folders.filter(folder => folder.pk !== 'medias')
          // 手动添加未分组文件夹
          folders.push({
            pk: 'medias', qualifier: 'medias', name: '未分组图片'
          })
          this.treeFolderData = folders

          // 默认选中未分组，并查询图片列表
          // this.getFolderImageList({pk: 'medias'})

          // 若vuex中不存在已选择的文件夹，默认选中未分组
          this.getFolderImageList({pk: this.selFolderId || 'medias'})

          // 设置树节点高亮 => 改为设置current-node-key属性 (原方法默认选中二级目录不生效)
          // this.$nextTick(() => {
          //   this.$refs['treeFolder'].setCurrentKey('medias')
          // })
        }
      }, this.apiHandleError)
      this.treeFolderLoading = false
    },
    // 获取子文件夹列表
    getTreeChildData: async function (pk, resolve) {
      // this.treeFolderLoading = true
      if (!pk) return
      const data = {}
      await this.$api.query(this.$api.file.subFolder, {data, urlMerge: '/'+pk}).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          const folders = res.data.subFolders
          resolve(folders)
        }
      }, this.apiHandleError)
      // this.treeFolderLoading = false
    },
    // 获取图片box选中状态
    getImageBoxClass: function (image) {
      return this.checkImageSelected(image) && this.multiple === true ? 'sel' : ''
    },
    // 文件夹展开事件
    treeFolderOpen: async function (node, resolve) {
      this.setSelNode(node)
      this.getTreeChildData(node.data.pk, resolve)
    },
    // 发起点击事件
    openDialog: function () {
      this.loadDialog = true
      // 获取一级目录列表
      this.$nextTick(() => {
        if (!this.treeFolderData.length) {
          this.getTreeMainData()
        }
        this.$refs['dialog'].openDialog()
      })
    },
    // 关闭弹框
    closeDialog: function () {
      this.$refs['dialog'].closeDialog()
    },
    // 还原一些数据
    afterDialogClose: function () {
      this.imageSelectList = []
      /*
      this.treeFolderSelPk = ''
      this.imagePageNo = 1
      this.imageTotal = 0
      this.imageListData = []
      */
    },
    // 获取文件夹内图片
    getFolderImageList: async function (obj) {
      let pk
      if (obj) {
        pk = obj.pk
        this.imagePageNo = 1
        this.treeFolderSelPk = pk
        this.setSelFolderId(pk)
      } else {
        pk = this.treeFolderSelPk
        this.setSelFolderId(pk)
      }
      this.imageListLoading = true
      const data = {parentPk: pk, pageNumber: this.imagePageNo, pageSize: this.imagePageSize, sortDataList: {createTime: "desc"}, withMedias: true}
      if (this.sortParams) {
        data.sortDataList = this.jsonClone(this.sortParams)
      }
      const urlMerge = '/' + pk
      await this.$api.query(this.$api.file.subFolder, {data, urlMerge}).then(({ res }) => {
        if (this.checkApiSuccess(res)) {
          this.imageListData = res.data.medias.records
          this.imageTotal = res.data.medias.pageData.total
        }
      }, this.apiHandleError)
      
      this.imageListLoading = false
    },
    // 图片翻页事件
    imageListIndexChange: function (index) {
      this.imagePageNo = index
      this.getFolderImageList()
    },
    // 处理图片点击事件
    handImageClick: function (image) {
      if (this.multiple) {
        const {pk} = image
        const imageSeled = this.imageSelectList.find(obj => obj.pk === pk)
        if (imageSeled) {
          const index = this.imageSelectList.indexOf(imageSeled)
          this.imageSelectList.splice(index, 1)
        } else {
          this.imageSelectList.push(this.jsonClone(image))
        }
      } else {
        this.$emit('image-select', image)
        this.closeDialog()
      }
    },
    // 判断图片是否选中
    checkImageSelected: function (image) {
      return Boolean(this.imageSelectList.find(obj => obj.pk === image.pk))
    },
    // 确认所选图片
    onImageSelect: function () {
      this.$emit('image-select', this.imageSelectList)
      this.closeDialog()
    },
    // 排序
    handleCommand(item) {
      this.currentSort = Object.assign(this.currentSort, item)
      let sortParams = {}
      sortParams[item.field] = item.sort
      this.sortParams = sortParams
      this.getFolderImageList()
    }
  },
  created: function () {
    this.sortParams = {
      updateTime: 'desc'
    }
    this.currentSort = {
      field: 'updateTime',
      name: '更新时间由新到旧',
      sort: 'desc'
    }
    this.dataInit()
  },
  mounted: function () {
    // this.getTreeMainData()
  }
}
</script>

<style lang="scss" scoped>
$content-height: 480px;
.default-image-picker{
  // display: inline-block;
  .image-picker-wraper{
    cursor: pointer;
  }
}
.dialog-picker-wrap{
  min-height: $content-height + 1px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
  .left-menu{
    height: $content-height;
    width: 300px;
    float: left;
    border-right: 1px solid #eee;

    .treeFolder >>>{
      padding: 20px;
      .el-tree-node__content{
        height: 32px;
      }
    }

    .el-scrollbar /deep/{
      height: 100%;
      width: 100%;
      .el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }
  .right-wrap{
    height: $content-height;
    float: right;
    width: 700px;
    padding: 8px;
    .msg{
      font-size: 24px;
      color: #999;
      background-color: #f6f6f6;
      height: 100%;
      letter-spacing: 2px;
      text-align: center;
      line-height: 450px;
    }
    .image-list{
      height: 420px;
      .image-wrap{
        float: left;
        width: 120px;
        height: 120px;
        margin: 8px;

        .image-box{
          width: 110px;
          height: 110px;
          margin: 0 auto;
          border: 3px solid #f5f5f5;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover{
            transform: translateY(-5px);
            box-shadow: 5px 5px 10px #ccc;
          }
          .default-video{
            width: 100%;
            height: 100%;
          }
          .el-image{
            width: 100%;
            height: 100%;
          }
          .el-icon-check{
            position: absolute;
            display: none;
            top: -2px;
            right: -2px;
            padding: 2px;
            background-color: $color;
            color: #fff;
            z-index: 1;
          }

          &.sel{
            border-color: $color;
            .el-icon-check{
              display: inline-block;
            }
          }
        }
        >span{
          margin-top: 2px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          @include oneLine();
        }
      }
    }
    .sort-list{
      margin: 20px 0 0 10px;
    }
    .el-pagination{
      float: right;
      margin: 15px 10px;
      text-align: right;
    }
  }
}
</style>
