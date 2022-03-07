/*
*  @ 通用 page-fixed 标题栏组件
*  @
*/
<template>
  <div class="page-fixed-title" :style="'left:'+fixedTitleLeft+'px;'">
    <!-- 标题 -->
    <div v-if="title" class="title">{{title}}</div>
    <!-- 按钮栏 -->
    <div class="btn-wrap" :class="title ? '':'whole-line'">
      <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'page-box-title',
  data () {
    return {
      fixedTitleLeft: 240
    }
  },
  props:{
    // 标题
    title: { type: String, default: '' },
    // 按钮列表
    buttonList: {type: Array, default: () => { return [] }}
  },
  computed: {
    ...mapState({
      menuShow:state=>state.common.menuShow
    })
  },
  watch:{
    menuShow: function (menuShow) {
      this.fixedTitleLeft = menuShow ? 240 : 0
    }
  },
  methods: {
    initData: function () {
      this.buttonList.forEach(button => {
        if (!button.float) {
          button.float = 'right'
        }
      })
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
.page-fixed-title{
  position: fixed;
  right: 0;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  box-shadow: 6px 9px 9px rgb(168, 168, 168);
  overflow: auto;
  background: #fff;
  z-index: 99;
  transition: all 0.3s;

  .title{
    color: #333;
    height: 36px;
    line-height: 36px;
    float: left;
    font-weight: bold;
    font-size: 16px;
    margin-left: 8%;
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