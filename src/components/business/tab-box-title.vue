/*
*  @ 通用 tab 页签内通用标题栏组件
*  @
*/
<template>
  <div class="tab-box-title">
    <!-- 标题 -->
    <div class="title">{{title}}</div>
    <!-- 按钮栏 -->
    <div class="btn-wrap">
      <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab-box-title',
  data () {
    return {

    }
  },
  props:{
    // 标题
    title: { type: String, default: '' },
    // 按钮列表
    buttonList: {type: Array, default: () => { return [] }}
  },
  watch:{

  },
  methods: {

  },
  created () {

  },
  mounted () {

  }
}
</script>
<style lang="scss" scoped>
.tab-box-title{
  padding: 10px;
  overflow: auto;
  margin-bottom: -10px;

  .title{
    color: #333;
    height: 36px;
    line-height: 36px;
    float: left;
  }

  .btn-wrap{
    margin: 2px 0;
    float: right;
    .default-button{
      float: left;
      margin-left: 10px;
    }
  }
}
</style>