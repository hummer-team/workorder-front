/*
*  @ 全局基础富文本组件
*  @ editorConfig 配置菜单项
*  @ uploadHandler 在线图片网址处理
*  @ isDisabled Editor 编辑状态
*  @ onChange Editor 输入改变
*/
<template>
  <div class="basic-item-wrap default-editor" :class="getItemWrapClass()">
    <div ref="editor"></div>
    <vue-js-editor ref='editor' v-model="innerValue" :config="editorConfig" :isDisabled="isDisabled" @input="onChange"></vue-js-editor>
    <div class="editor-placeholder" v-if="!innerValue">
      <span>{{getPlaceholder()}}</span>
    </div>
  </div>
</template>

<script>
  import vueJsEditor from 'vuejs-editor'
  import basicItemMixin from './basic-item-mixin'
  export default {
    name: 'default-editor',
    mixins: [basicItemMixin],
    provide () {
      return {
        getModule: () => null
      }
    },
    components: {
      vueJsEditor
    },
    data () {
      return {
        innerValue: '',
        editor: null,
        // 是否禁用
        disabled: false,
        editorConfig: {
          printLog: false,
          hideLinkImg:false,
          menus: [
            'source',
            '|',
            'bold',
            'underline',
            'italic',
            'strikethrough',
            'eraser',
            'forecolor',
            'bgcolor',
            'fontsize',
            'orderlist',
            'table',
            'insertcode',
          ],
        }
      }
    },
    props: {
    },
    computed : {
      isDisabled: function () {
        console.log('1312312',this.getDisabled() )
        return this.getDisabled()
      }
    },
    watch: {
      innerValue: function (val, oldVal) {
        // 暂用补丁形式解决editor清空时默认值的BUG
        if (val === '<p><br></p>') {
          this.innerValue = ''
        }
      }
    },
    methods: {
      // 获取disabled状态
      getDisabled: function () {
        if (this.isFunction(this.data.disabled)) {
          return this.data.disabled(this.rowData)
        } else {
          return this.disabled
        }
      },
      // 当绑定值变化时触发的事件
      onChange: function () {
      },
      getPlaceholder: function () {
        if (this.isFunction(this.data.placeholder)) {
          return this.data.placeholder()
        } else {
          return ''
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
.default-editor{
  position: relative;
  height: auto;
  >>> .wangEditor-container .wangEditor-txt{
    font-size: 14px;
    color: #525E71;
    font-family: FZLanTingHeiS-R-GB;
    div, span, header, footer, nav, section, aside, article, ul, dl, dt, dd, li, a, p, h1, h2, h3, h4, h5, h6, i, b, textarea, button, input, select, figure, figcaption{
      font-family: FZLanTingHeiS-R-GB;
    }
  }
  >>> .vue-js-editor{
    min-height: 200px;
  }
  .editor-placeholder{
    position: absolute;
    left: 17px;
    top: 34px;
    color: #caccd3;
    z-index: 99;
    user-select: none;
    white-space: pre;
    pointer-events: none;
  }
  
}
</style>
