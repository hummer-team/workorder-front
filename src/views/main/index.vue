<template>
  <div v-if="!refreshTag">
    <index-accenture></index-accenture>
    <footer>
      <!-- <router-link target="_blank" tag="a" to="/Icp">沪ICP备08100043号-70</router-link> -->
    </footer>
  </div>
</template>

<script>
import IndexAccenture from './index-accenture.vue'

export default {
  data () {
    return {
      refreshTag: false
    }
  },
  components: {
    IndexAccenture
  },
  computed : {
  },
  watch: {
    siteId: function () {
      this.refresh()
    }
  },
  methods:{
    refresh: function () {
      this.refreshTag = true
      this.$nextTick(() => {
        this.refreshTag = false
      })
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="scss" scoped>

</style>
