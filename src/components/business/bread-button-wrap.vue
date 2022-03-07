/*
*  @ 全局通用顶部按钮区域组件
*  @
*/
<template>
  <div class="bread-button-wrap">
    <slot name="prepend"></slot>
    <default-button v-for="(button, index) in buttonList" :key="index" :data="button"></default-button>
    <slot name="append"></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'bread-button-wrap',
  data () {
    return {
      defaultFloat: 'right'
    }
  },
  components: {},
  props: {
    buttonList: { type: Array, default: () => [] }
  },
  computed : {},
  methods: {
    dataInit: function () {
      if (this.buttonList.length) {
        this.buttonList.forEach(button => {
          if (!button.float) button.float = this.defaultFloat
        })
      }
    }
  },
  created: function (){
    this.dataInit()
  },
  mounted: function () {
    
  }
}
</script>

<style lang="scss" scoped>
.bread-button-wrap{
  padding: 20px 20px 0;
  margin-bottom: -10px;
  background-color: #fff;
  overflow: auto;

  .default-button{
    float: left;
    margin-left: 10px;
  }
}
</style>
