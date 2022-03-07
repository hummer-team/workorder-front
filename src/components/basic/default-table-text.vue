/*
*  @ 全局基础文本组件
*  @
*/
<template>
  <div class="basic-item-wrap default-table-text">
    <div v-if="value" @mouseover="mouseover = true" @mouseleave="mouseover = false">
      <span class="shrink-text" v-html="value" v-if="!mouseover"></span>
      <span v-else v-html="value"></span>
    </div>
    <div v-else>-</div>
  </div>
</template>

<script>
import basicItemMixin from './basic-item-mixin'
export default {
  name: 'default-table-text',
  mixins: [basicItemMixin],
  data () {
    return {
      mouseover: false
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
.default-table-text{
  white-space: pre;
  .shrink-text{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
