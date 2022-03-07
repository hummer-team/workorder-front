/*
*  @ 全局基础文本组件
*  @
*/
<template>
  <div class="basic-item-wrap default-tooltip">
    <div class="button" v-if="!show" @click="onClick">展开</div>
    <div class="button" v-else @click="onClick">收起</div>
    <span class="content" v-if="show">{{innerValue}}</span>
    <!-- <el-tooltip class="tooltip" placement="top-start">
      <span slot="content">{{inner()}}</span>
      <i class="el-icon-question"></i>
    </el-tooltip> -->
  </div>
</template>

<script>
import Vue from 'vue'
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-tooltip',
  mixins: [basicItemMixin],
  data () {
    return {
      show: false
    }
  },
  props: {
  },
  computed : {
  },
  watch: {
  },
  methods: {
    dataInit: function () {
    },
    onClick: function () {
      this.show = !this.show
    }
  },
  created: function (){
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.default-tooltip{
  height: auto;
  .button{
    cursor: pointer;
    text-decoration: underline;
  }
  .content{
    white-space: pre;
  }
  // .tooltip{
  //   font-size: 20px;
  //   white-space: pre;
  //   span{
  //     white-space: pre;
  //   }
  // }
}
</style>
