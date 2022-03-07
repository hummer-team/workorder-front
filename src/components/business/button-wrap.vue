/*
*  @ 全局通用按钮区域组件
*  @
*/
<template>
  <div class="button-wrap">
    <slot name="prepend"></slot>
    <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    <slot name="append"></slot>
  </div>
</template>

<script>
export default {
  name: 'button-wrap',
  data () {
    return {
    }
  },
  components: {},
  props: {
    align: { type: String, default: 'right' },
    buttonList: { type: Array, default: () => [] }
  },
  computed : {},
  methods: {
    initData: function () {
      this.buttonList.forEach(button => {
        if (!button.float) {
          button.float = this.align
        }
      })
    }
  },
  created: function (){
    this.initData()
  },
  mounted: function () {
    
  }
}
</script>

<style lang="scss" scoped>
.button-wrap{
  line-height: 40px;
  overflow: hidden;

  .default-button{
    display: inline-block;
  }
}
</style>
