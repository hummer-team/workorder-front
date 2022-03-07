<template>
  <div class="header-line">
    <img class="open-menu" :style="getOpenMenuStyle()" @click="setMenuHide" src="@/assets/images/icon/open-menu.svg">
    <!-- <div class="title">微软业务中台</div> -->
    <!-- <brand-select></brand-select> -->
    <div class="right">
      <user-box></user-box>
    </div>
  </div>
</template>

<script>
import brandSelect from '@/components/main/brand-select'
import userBox from '@/components/main/user-box'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name:'common-header',
  data () {
    return {
      openMenuOpp: false
    }
  },
  components: {
    brandSelect,
    userBox
  },
  computed: {
    ...mapState({
      menuShow:state=>state.common.menuShow
    })
  },
  watch: {
    menuShow: function (menuShow) {
        this.openMenuOpp = !menuShow
    }
  },
  methods: {
    ...mapActions([
      'doMenuShow'
    ]),
    setMenuHide: function () {
      this.openMenuOpp = !this.openMenuOpp
      this.doMenuShow({menuShow: !this.openMenuOpp})
    },
    getOpenMenuStyle: function () {
      let style = {}
      if (this.openMenuOpp) {
        style.transform = 'rotateY(180deg)'
      }
      return style
    }
  },
  created(){
    
  },
  mounted(){
    
  }
}
</script>

<style lang="scss" scoped>
div.header-line{
  height: 60px;
  line-height: 60px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  background-color: #fff;
  overflow: hidden;
  z-index: 10;
  position: absolute;
  width: 100%;
  top: 0;

  .open-menu{
    width: 40px;
    height: 60px;
    float: left;
    padding-left: 10px;
    margin-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .title{
    color: #ffb600;
    font-size: 18px;
    font-weight: bolder;
    text-indent: 0px;
    float: left;
  }
  .right{
    margin-right: 20px;
    float: right;
  }
}
</style>
