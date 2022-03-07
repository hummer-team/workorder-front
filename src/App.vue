<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
    <!-- <div class="authority-wrap" v-show="showAuthority">
      <div class="authority-box">
        <p>请输入验证</p>
        <el-input type="password" v-model="authorityCode"></el-input>
      </div>
    </div> -->
  </div>
</template>

<script>
import storage from '@/utils/storage'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
	components:{},
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      showAuthority: false,
      authorityCode: '',
      isRouterAlive: true
    }
  },
	computed : {},
  methods: {
    reload: function () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  watch: {
    // authorityCode: function (code) {
    //   if (code === 'accenture-zt') {
    //     localStorage.setItem('authority', true)
    //     this.showAuthority = false
    //   }
    // }
  },
  mounted: async function () {
    localStorage.setItem('siteId', 'microsoft')
    let router = this.$route
    let isAuthority = this.isAuthority()
    if (!isAuthority && router.name !== 'CMSDemo') {
      this.showAuthority = true
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/ress';
@import './assets/css/common';
@import './assets/css/app';
/** 字体 样式 **/
@import './assets/font/font.css';
/** demo样式 **/
.authority-wrap{
  width: 100%;
  height: 100%;
  top: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  z-index: 1000000;

  .authority-box{
    top: 50%;
    position: absolute;
    width: 200px;
    height: 100px;
    background-color: #f3f3f3;
    border-radius: 6px;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    margin-left: -100px;
    padding: 10px;

    p{
      line-height: 40px;
      color: #333;
      text-align: center;
    }

    input{
      width: 100%;
      height: 36px;
      line-height: 36px;
      border-radius: 6px;
      border: 1px solid #ccc;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
