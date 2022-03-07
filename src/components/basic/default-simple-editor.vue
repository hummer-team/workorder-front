/*
*  @ 全局基础输入框组件
*  @
*/
<template>
  <div class="basic-item-wrap default-simple-editor">
    <default-validate ref="validate" type="input" :value="value" :label="label" :data="validate" :row-data="rowData" @setValidateData="setValidateData"></default-validate>
    <div class="edit-wrap">
      <div class="edit-header">
        <div class="left-header">
          <!-- <span class="edit-title">{{item.title}}({{item.code}})</span> -->
        </div>
        <div class="right-header">
          <div class="link-btn-wrap">
            <div class="update-btn-wrap" v-if="isShowDeleteLinkBtn">
              <span class="strong-btn" @click="deleteLink()">删除链接</span>
              <span class="strong-btn" @click="updateLink()">编辑链接</span>
            </div>
            <span v-else class="strong-btn" @click="insertLink()">插入链接</span>
          </div>
          <span class="strong-btn" @click="strongItem()">加粗</span>
        </div>
      </div>
      <div v-if="refreshTag" class="edit-content" @mouseup="onSelectOver()">
        <div class="content-box">
          <!-- <el-input v-if="['paragraph', 'title', 'note'].includes(item.type)" class="input-box" v-model="item.data" type="textarea" :disabled="getDisabled()" :autosize="true" resize="none" @keyup.enter.native="onSubmit">
          </el-input> -->
          <div class="input-box" @mouseup="onSelectOver()">
            <div class="hover-link-box">
              <div v-if="hoverType">类型: {{linkTypeOptions.find(item => item.code === hoverType).name}}</div>
              <div v-if="hoverUrl">路径: {{hoverUrl}}</div>
              <div v-if="hoverAppid">appid: {{hoverAppid}}</div>
              <div v-if="hoverPath">路径: {{hoverPath}}</div>
              <div v-if="hoverVersion">版本: {{hoverVersion}}</div>
            </div>
            <p :id="'p_tag_' + data.field" :contenteditable="getDisabled() ? false : true" @keyup.delete="onPTagDelete()" @keyup.enter="onPTagDelete()" @keyup.left="onSelectOver()" @keyup.right="onSelectOver()" @keyup.up="onSelectOver()" @keyup.down="onSelectOver()" @paste="onPaste" @input="onInput()">
            </p>
          </div>
        </div>
      </div>
    </div>
    <default-dialog-form ref="form-dialog" title="配置链接" :form-data="linkDialog.formData" :form-items="linkDialog.formItems" :form-submit="onLinkDialogFormSubmit"></default-dialog-form>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-input',
  mixins: [basicItemMixin],
  data () {
    return {
      refreshTag: true,
      isShowDeleteLinkBtn: false,
      // 选中文字内容
      selectString: '',
      // 选中文字数组
      selectStringArr: [],
      // 选中文字index范围
      selectRange: [],
      baseNode: undefined,
      // 选中文字开始dom节点
      baseNodeParentEl: undefined,
      // 选中文字结束dom节点
      extentNodeParentEl: undefined,
      // 选中文字开始上一元素
      baseNodePreviousEl: undefined,
      // 选中文字开始下一元素
      baseNodeNextEl: undefined,
      // 选中文字结束上一元素
      extentNodePreviousEl: undefined,
      // 选中文字结束下一元素
      extentNodeNextEl: undefined,
      range: undefined,
      linkTypeOptions: [
        { name: '当前小程序指定页面', code: 'URL' },
        { name: '其他小程序', code: 'MiniProgram' }
      ],
      versionData: [
        { name: '正式版', code: 'formal' },
        { name: '开发版', code: 'develop' },
        { name: '体验版', code: 'trial' }
      ],
      linkDialog: {
        type: 'create',
        formData: {
          url: ''
        },
        formItems: [
          { label: '链接类型', field: 'type', type: 'select', options: () => this.linkTypeOptions, validate: { isRequired: true }, span: 24, onChange: (value, row) => {
            if (value === 'URL') {
              row.appid = ''
              row.path = ''
              row.version = ''
            } else {
              row.url = ''
            }
          } },
          { label: '页面路径', field: 'url', validate: { isRequired: true }, span: 24, isLoad: ({ row }) => row.type === 'URL' },
          { label: 'appid', field: 'appid', validate: { isRequired: true }, span: 24, isLoad: ({ row }) => row.type === 'MiniProgram' },
          { label: '跳转路径', field: 'path', validate: { isRequired: true }, span: 24, isLoad: ({ row }) => row.type === 'MiniProgram' },
          { label: '版本', field: 'version', type: 'select', options: () => this.versionData, validate: { isRequired: true }, span: 24, isLoad: ({ row }) => row.type === 'MiniProgram' }
        ]
      },
      updateNode: undefined,
      hoverCode: '',
      hoverType: '',
      hoverUrl: '',
      hoverAppid: '',
      hoverPath: '',
      hoverVersion: ''
    }
  },
  props: {
  },
  computed : {
  },
  watch: {
  },
  methods: {
    // 初始化配置参数
    dataInit: function () {
      const { label } = this.data
      this.label = this.isSet(label) ? label : ''
    },
    // 加粗选中文字
    strongItem: function () {
      // 若无选中内容，不触发加粗
      if (!this.selectString || !this.selectStringArr || !this.selectStringArr.length) {
        return
      }
      if (this.selectStringArr.length > 1) {
        this.warning('暂不支持跨行操作')
        return
      }
      const el = document.getElementById('p_tag_' + this.data.field)
      const elInnerText = el.innerText
      const elInnerTextArr = elInnerText.split('\n')
      
      // 选中范围在同一个b标签内
      if ((this.baseNodeParentEl === this.extentNodeParentEl) && this.baseNodeParentEl.localName === 'b') {
        const arr = this.baseNodeParentEl.innerHTML.split(this.selectString)

        let newNode = document.createElement('text')
        newNode.innerHTML = '<b>' + arr[0] + '</b>' + this.selectString + '<b>' + arr[1] + '</b>'
        this.baseNodeParentEl.parentNode.replaceChild(newNode, this.baseNodeParentEl)
      } else {
        const txt = this.range.extractContents().textContent
        // 创建新的元素 strong
        var bold = document.createElement('b')
        // 设置 strong 内容
        bold.innerHTML = txt
        // 在被选择的位置添加加粗的元素
        this.range.insertNode(bold)
      }

      // 清理多余的标签
      while (el.innerHTML.includes('<text>')) {
        el.innerHTML = el.innerHTML.replace('<text>', '')
      }
      while (el.innerHTML.includes('</text>')) {
        el.innerHTML = el.innerHTML.replace('</text>', '')
      }
      while (el.innerHTML.includes('<b></b>')) {
        el.innerHTML = el.innerHTML.replace('<b></b>', '')
      }
      while (el.innerHTML.includes('</b><b>')) {
        el.innerHTML = el.innerHTML.replace('</b><b>', '')
      }

      this.bindValue()
    },
    // 鼠标选中或者键盘选中，记录选中文字位置
    onSelectOver: function () {
      // 初始化数据
      this.isShowDeleteLinkBtn = false
      // 0.1s后触发防止刚放开鼠标时取消选中，但仍然读取上一次选中的数据
      setTimeout(() => {
        const selection = window.getSelection()
        const selectString = selection.toString()
       
        this.selectString = selectString
        this.selectStringArr = selectString.split('\n')
       
        this.selectRange = [selection.baseOffset, selection.extentOffset]
        this.baseNode = selection.baseNode
        this.baseNodeParentEl = selection.baseNode.parentElement
        this.extentNodeParentEl = selection.extentNode.parentElement
        this.baseNodePreviousEl = selection.baseNode.previousElementSibling
        this.baseNodeNextEl = selection.baseNode.nextElementSibling
        this.extentNodePreviousEl = selection.extentNode.previousElementSibling
        this.extentNodeNextEl = selection.extentNode.nextElementSibling

        this.range = window.getSelection().getRangeAt(0)

        // 判断是否显示删除链接按钮
        if ((this.baseNodeParentEl === this.extentNodeParentEl) && this.baseNodeParentEl.localName === 'a') {
          this.isShowDeleteLinkBtn = true
        }
        if ((this.baseNodeParentEl.parentNode === this.extentNodeParentEl.parentNode) && this.baseNodeParentEl.parentNode.localName === 'a') {
          this.isShowDeleteLinkBtn = true
        }
        let offset = 0
      }, 100)
    },
    // 插入链接
    insertLink: function (code) {
      // 若无选中内容，不触发插入链接
      if (!this.selectString || !this.selectStringArr || !this.selectStringArr.length) {
        return
      }
      if (this.selectStringArr.length > 1) {
        this.warning('暂不支持跨行操作')
        return
      }
      this.linkDialog.type = 'create'
      this.linkDialog.formData = {
        url: '',
        appid: '',
        path: '',
        version: ''
      }
      this.openDialog('form-dialog')
    },
    // 编辑链接
    updateLink: function () {
      this.linkDialog.type = 'update'
      const el = document.getElementById('p_tag_' + this.data.field)
      const elInnerText = el.innerText
      const elInnerTextArr = elInnerText.split('\n')
      let targetNode = undefined
      // 选中范围在同一个a标签内
      if ((this.baseNodeParentEl === this.extentNodeParentEl) && this.baseNodeParentEl.localName === 'a') {
        targetNode = this.baseNodeParentEl
      } else if ((this.baseNodeParentEl.parentNode === this.extentNodeParentEl.parentNode) && this.baseNodeParentEl.parentNode.localName === 'a') {
        targetNode = this.baseNodeParentEl.parentNode
      }
      if (targetNode) {
        const data = {
          // code: code,
          type: targetNode.attributes['type'] ? targetNode.attributes['type'].nodeValue : '',
          url: targetNode.attributes['code'] && code === 'URL' ? targetNode.attributes['code'].nodeValue : '',
          appid: targetNode.attributes['appid'] ? targetNode.attributes['appid'].nodeValue : '',
          path: targetNode.attributes['path'] ? targetNode.attributes['path'].nodeValue : '',
          version: targetNode.attributes['version'] ? targetNode.attributes['version'].nodeValue : ''
        }
        this.linkDialog.formData = this.filterEmptyFormData(data)
        this.updateNode = targetNode
        this.openDialog('form-dialog')
      }
    },
    // 删除链接
    deleteLink: function () {
      const el = document.getElementById('p_tag_' + this.data.field)
      const elInnerText = el.innerText
      const elInnerTextArr = elInnerText.split('\n')
      // 选中范围在同一个a标签内
      if ((this.baseNodeParentEl === this.extentNodeParentEl) && this.baseNodeParentEl.localName === 'a') {
        let newNode = document.createElement('text')
        newNode.innerHTML = this.baseNodeParentEl.innerHTML
        this.baseNodeParentEl.parentNode.replaceChild(newNode, this.baseNodeParentEl)
      } else if ((this.baseNodeParentEl.parentNode === this.extentNodeParentEl.parentNode) && this.baseNodeParentEl.parentNode.localName === 'a') {
        let newNode = document.createElement('text')
        newNode.innerHTML = this.baseNodeParentEl.parentNode.innerHTML
        this.baseNodeParentEl.parentNode.parentNode.replaceChild(newNode, this.baseNodeParentEl.parentNode)
      }

      // 清理多余的标签
      while (el.innerHTML.includes('<text>')) {
        el.innerHTML = el.innerHTML.replace('<text>', '')
      }
      while (el.innerHTML.includes('</text>')) {
        el.innerHTML = el.innerHTML.replace('</text>', '')
      }
      this.bindValue()
    },
    onMouseDown: function () {
    },
    onPaste: function (event) {
      var e = event || window.event
      // 阻止默认粘贴
      e.preventDefault();
      // 粘贴事件有一个clipboardData的属性，提供了对剪贴板的访问
      // clipboardData的getData(fomat) 从剪贴板获取指定格式的数据
      var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
      // 插入
      document.execCommand("insertText", false, text);
      this.bindValue()
    },
    onLinkDialogFormSubmit: function (formData) {
      const el = document.getElementById('p_tag_' + this.data.field)
      const elInnerText = el.innerText
      const elInnerTextArr = elInnerText.split('\n')
      if (this.linkDialog.type === 'create') {
        // 若无选中内容，不触发加粗
        if (!this.selectString || !this.selectStringArr || !this.selectStringArr.length) {
          return
        }
        // 选中范围在同一个b标签内
        if ((this.baseNodeParentEl === this.extentNodeParentEl) && this.baseNodeParentEl.localName === 'a') {
        } else {
          const txt = this.range.extractContents().textContent
          // 创建新的元素 a
          var a = document.createElement('a');
          // 设置 a 内容
          a.innerHTML = txt;
          // a.onmouseover = () => function (formData) {
          //   console.log('asdasdujyuzxj78127312731283128', formData)
          //   that.success('haha ')
          // }
          a.onmouseover = () => this.customizeOnmouseover(formData)
          a.onmouseout = () => this.customizeOnmouseout(formData)
          // a.hover = function () {
          // }
          a.setAttribute('type', formData.type)
          if (formData.type === 'URL') {
            a.setAttribute('code', formData.url)
          } else {
            a.setAttribute('appid', formData.appid)
            a.setAttribute('path', formData.path)
            a.setAttribute('version', formData.version)
          }
          // 在被选择的位置添加加粗的元素
          this.range.insertNode(a);
        }
      } else {
        // 更新
        this.updateNode.onmouseover = () => this.customizeOnmouseover(formData)
        this.updateNode.onmouseout = () => this.customizeOnmouseout(formData)
        // a.hover = function () {
        // }
        this.updateNode.setAttribute('type', formData.type)
        if (formData.type === 'URL') {
          this.updateNode.setAttribute('code', formData.url)
          this.updateNode.removeAttribute('appid')
          this.updateNode.removeAttribute('path')
          this.updateNode.removeAttribute('version')
        } else {
          this.updateNode.setAttribute('appid', formData.appid)
          this.updateNode.setAttribute('path', formData.path)
          this.updateNode.setAttribute('version', formData.version)
          this.updateNode.removeAttribute('url')
        }
      }

      // 清理多余的标签
      while (el.innerHTML.includes('<text>')) {
        el.innerHTML = el.innerHTML.replace('<text>', '')
      }
      while (el.innerHTML.includes('</text>')) {
        el.innerHTML = el.innerHTML.replace('</text>', '')
      }
      while (el.innerHTML.includes('<b></b>')) {
        el.innerHTML = el.innerHTML.replace('<b></b>', '')
      }
      while (el.innerHTML.includes('</b><b>')) {
        el.innerHTML = el.innerHTML.replace('</b><b>', '')
      }
      this.$refs['form-dialog'].closeDialog()
      this.bindValue()
    },
    customizeOnmouseover: function (formData) {
      // this.hoverCode = formData.code
      this.hoverType = formData.type
      this.hoverUrl = formData.url
      this.hoverAppid = formData.appid
      this.hoverPath = formData.path
      this.hoverVersion = formData.version
    },
    customizeOnmouseout: function (formData) {
      // this.hoverCode = ''
      this.hoverType = ''
      this.hoverUrl = ''
      this.hoverAppid = ''
      this.hoverPath = ''
      this.hoverVersion = ''
    },
    onSubmit: function () {
    },
    // p标签退格
    onPTagDelete: function (code) {
    },
    // 获取disabled状态
    getDisabled: function () {
      if (this.isFunction(this.data.disabled)) {
        return this.data.disabled(this.rowData)
      } else {
        return false
      }
    },
    // innerHTML绑定innerValue
    bindValue: function () {
      this.innerValue = document.getElementById('p_tag_' + this.data.field).innerHTML
    },
    onInput: function () {
      this.bindValue()
    }
  },
  created: function () {
  },
  mounted: function () {
    if (this.innerValue) {
      let el = document.getElementById('p_tag_' + this.data.field)
      // let data = this.innerValue
      if (this.innerValue.includes('<br>')) {
        this.innerValue = this.innerValue + '</div>'
        this.innerValue = this.innerValue.replace('<br>', '<div>')
        this.innerValue = this.innerValue.replaceAll('<br>', '</div><div>')
      }
      el.innerHTML = this.innerValue

      let childNodes = el.childNodes
      while (childNodes && childNodes.length) {
        let newChildNodes = []
        childNodes.forEach(node => {
          if (node.localName && node.localName === 'a') {
            let data = {
              type: node.attributes['type'] ? node.attributes['type'].nodeValue : '',
              url: node.attributes['code'] && node.attributes['type'] && node.attributes['type'].nodeValue === 'URL' ? node.attributes['code'].nodeValue : '',
              appid: node.attributes['appid'] ? node.attributes['appid'].nodeValue : '',
              path: node.attributes['path'] ? node.attributes['path'].nodeValue : '',
              version: node.attributes['version'] ? node.attributes['version'].nodeValue : ''
            }
            data = this.filterEmptyFormData(data)
            node.onmouseover = () => this.customizeOnmouseover(data)
            node.onmouseout = () => this.customizeOnmouseout(data)
          } else {
            newChildNodes.push(...node.childNodes)
          }
        })
        childNodes = newChildNodes
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.default-simple-editor{
  height: auto !important;
  .edit-wrap{
    flex: 1;
    .edit-header{
      display: flex;
      justify-content: space-between;
      background: #c0c2c5;
      .left-header{
        padding-left: 10px;
      }
      .right-header{
        padding-right: 10px;
        .link-btn-wrap{
          display: contents;
          .update-btn-wrap {
            display: contents;
          }
        }
        .del-btn{
          text-decoration: underline;
          cursor: pointer;
        }
        .strong-btn{
          text-decoration: underline;
          cursor: pointer;
          user-select:none;
        }
      }
    }
    .edit-content{
      margin-top: -4px;
      .content-box{
        .input-box{
          border: 1px solid #DCDFE6;
          border-top: none;
          background: #fff;
          min-height: 64px;
          padding: 5px 13px 5px 13px;
          line-height: 1.5;
          position: relative;
          .hover-link-box{
            position: absolute;
            background: $color;
            color: #fff;
            padding: 0 20px;
            line-height: 20px;
            left: 175px;
            top: 0;
            transform: translateY(-100%);
            border-radius: 10px;
          }
          p{
            outline: none;
            position: relative;
          }
          .bullets-input{
            &:before{
              content: '';
              height: 5px;
              width: 5px;
              border-radius: 50%;
              position: absolute;
              left: -20px;
              top: 8px;
              background: #525E71;
            }
            >>>div{
              position: relative;
              &:before{
                content: '';
                height: 5px;
                width: 5px;
                border-radius: 50%;
                position: absolute;
                left: -20px;
                top: 8px;
                background: #525E71;
              }
            }
          }
        }
        .complex-box{
          border: 1px solid #DCDFE6;
          border-top: none;
          background: #fff;
          min-height: 64px;
          padding: 5px 13px 5px 35px;
          line-height: 1.5;
          position: relative;
          .hover-link-box{
            position: absolute;
            background: $color;
            color: #fff;
            padding: 0 20px;
            line-height: 20px;
            left: 175px;
            top: 0;
            transform: translateY(-100%);
            border-radius: 10px;
          }
          p{
            outline: none;
            position: relative;
            &:before{
              content: '';
              height: 5px;
              width: 5px;
              border-radius: 50%;
              position: absolute;
              left: -20px;
              top: 8px;
              background: #525E71;
            }
            >>>div{
              position: relative;
              &:before{
                content: '';
                height: 5px;
                width: 5px;
                border-radius: 50%;
                position: absolute;
                left: -20px;
                top: 8px;
                background: #525E71;
              }
            }
          }
        }
      }
    }
  }
}
</style>
