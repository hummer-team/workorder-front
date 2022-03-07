/*
*  @ 全局通用按钮区域组件
*  @
*/
<template>
  <div>
    {{data}}
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  components: {},
  props: {
    data: { type: Object, default: () => { return {} } },
    rowData: { type: Object, default: () => { return {} } }
  },
  computed : {},
  methods: {
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
</style>
