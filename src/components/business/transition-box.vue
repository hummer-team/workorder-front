/*
*  @ 通用 transition-box 组件 通用动画内容容器
*  @
*/
<template>
  <div class="transition-box">
    <el-collapse-transition>
      <slot v-if="showTag"></slot>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'transition-box',
  data () {
    return {

    }
  },
  props: {
    showTag: { type: Boolean, default: true }
  },
  watch: {

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
.transition-box{
}
</style>