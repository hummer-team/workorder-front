/*
*  @ 全局基础文本组件
*  @
*/
<template>
  <span class="basic-item-wrap default-rich-text" v-html="value">
  </span>
</template>

<script>
import Vue from 'vue'
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-rich-text',
  mixins: [basicItemMixin],
  data () {
    return {
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
  },
  created: function (){
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.default-rich-text{
}
</style>
