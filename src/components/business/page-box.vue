/*
*  @ 通用 page-box 组件 通用内容容器
*  @
*/
<template>
  <div class="page-box" :style="isFull ? 'min-height:100%' : ''">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'page-box',
  data () {
    return {

    }
  },
  props:{
    isFull: { type: Boolean, default: false }
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
.page-box{
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  background-color: #fff;
}
</style>