/*
*  @ 通用 page-box 标题栏组件
*  @
*/
<template>
  <div class="page-box-title" :class="isBold ? 'is-bold-box' : ''">
    <!-- 标题 -->
    <div v-if="title" class="title" :class="isBold ? 'is-bold' : ''">
      {{title}}
      <el-tooltip v-if="info" class="item" effect="dark" content="工单审批或执行操作参考工单规范说明" placement="top-start">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </div>
    <div v-if="isExtend" class="extend-wrap" @click="onClickExtend">
      <span v-if="extendTag">收起</span>
      <span v-else>展开</span>
    </div>
    <!-- 按钮栏 -->
    <div class="btn-wrap" :class="title ? '':'whole-line'">
      <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'page-box-title',
  data () {
    return {

    }
  },
  props:{
    // 标题
    title: { type: String, default: '' },
    // 按钮列表
    buttonList: {type: Array, default: () => { return [] }},
    // 是否折叠展开
    isExtend: { type: Boolean, default: false },
    // 折叠展开标识
    extendTag: { type: Boolean, default: true },
    // 点击标识方法
    onClickTag: { type: Function, default: null },
    // 是否加粗
    isBold: { type: Boolean, default: false },
    // 是否有信息
    info: { type: Boolean, default: false }
  },
  watch:{

  },
  methods: {
    initData: function () {
      this.buttonList.forEach(button => {
        if (!button.float) {
          button.float = 'right'
        }
      })
    },
    onClickExtend: function () {
      if (this.isFunction(this.onClickTag)) {
        this.onClickTag()
      }
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
.is-bold-box{
  border-bottom: 2px solid #eee !important;
  border-image: linear-gradient(to right, #fff, rgb(138, 138, 138), #fff) 5 5;
}
.page-box-title{
  padding: 10px 20px;
  // border: 10px solid #eee;
  border-bottom: 1px solid #eee;
  overflow: auto;

  .title{
    color: #333;
    height: 36px;
    line-height: 36px;
    float: left;
  }
  .is-bold{
    color: #000;
    font-size: 16px;
    font-weight: 700;
  }
  .extend-wrap{
    float: right;
    height: 36px;
    line-height: 36px;
    text-decoration: underline;
    cursor: pointer;
  }

  .btn-wrap{
    margin: 2px 0;
    float: right;
    &.whole-line{
      width: 100%;
    }
    .default-button{
      display: inline-block;
    }
  }
}
</style>