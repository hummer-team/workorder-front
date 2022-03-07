<template>
  <div class="main" :style="getMainStyle()">
    <div class="side-menu" :style="getMenuWrapStyle()">
      <img src="../assets/images/coop_logo.png" />
      <div class="menu-wrap">
        <el-scrollbar>
          <side-menu></side-menu>
        </el-scrollbar>
      </div>
      <div style="text-align:center;">
        <div style="text-align:center;">
          <p style="color:#939393;">@2022 EasyWorkSystem</p>
        </div>
      </div>
    </div>
    <div class="content-warp" :style="getContentWrapStyle()">
      <common-header></common-header>
      <page-menu-tab v-show="!isFullPage"></page-menu-tab>
      <div class="content-box" :style="getContentBoxStyle()" v-loading="loadingPageName !== ''">
        <el-scrollbar>
          <keep-alive :exclude="newPageName">
            <router-view v-if="checkRouterViewShow" class="content-router" :style="getContentRouterStyle()" />
          </keep-alive>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import sideMenu from '@/components/main/side-menu'
import commonHeader from '@/components/main/common-header'
import pageMenuTab from '@/components/main/page-menu-tab'

import { mapState,mapGetters,mapActions } from 'vuex'


export default {
  provide () {
    return {
      reload: this.reload,
      // 给通用upload组件预设的默认值，不加会引起报错
      getModule: () => null,
      handleDelTabMenu: this.delTabMenu
    }
  },
  data () {
    return {
      // 当前页面name
      pageName: '',
      menusAuthorityList: JSON.parse(localStorage.getItem('menusAuthorityList')) && JSON.parse(localStorage.getItem('menusAuthorityList')).map(m => m.code)
    }
  },
  components: { sideMenu, commonHeader, pageMenuTab },
  computed : {
    ...mapState({
      menuShow: state => state.common.menuShow,
      breadShow: state => state.common.breadShow,
      newPageName: state => state.common.newPageName,
      loadingPageName: state => state.common.loadingPageName,
      username: state => state.user.userName,
      menuTreeList: state => state.user.menusTree,
      roles: state => state.user.roles
    }),
    // ...mapGetters('user', ['authortityFlatterList']),
    // 需要完整展示的页面 - 商城定制操作页
    isFullPage: function () {
      return this.pageName === 'contentPageDetail'
    },
    isAuthMenu: function () {
      let pageName = this.$route.name
      // return true
      if (!this.menusAuthorityList) return true
      if (!this.menusAuthorityList.includes(pageName) && pageName !== 'mainIndex' && pageName !== 'otherSite') {
        return false
      }
      return true
    },
    checkRouterViewShow: function () {
      if (this.newPageName && this.pageName === this.newPageName) {
        return false
      }
      return true
    }
  },
  watch: {
    newPageName: function (page) {
      if (page) {
        this.$nextTick(() => {
          this.setNewPageName({pageName: ''})
          this.setLoadingPageName({pageName: ''})
        })
      }
    }
  },
  methods:{
    ...mapActions('user', ['doLoginOut']),
    ...mapActions(['setNewPageName', 'setLoadingPageName']),
    reload: function (name) {
      if (!name) {
        name = this.$route.name
      }
      this.setNewPageName({pageName: name})
    },
    loginOut: function () {
      this.doLoginOut(this)
    },
    getMainStyle: function () {
      let style = {}
      if (!this.menuShow) {
        style.paddingLeft = 0
      }
      return style
    },
    getMenuWrapStyle: function () {
      let style = {}
      if (!this.menuShow) {
        style.transform = 'scale(0, 1)'
      }
      return style
    },
    getContentWrapStyle: function () {
      let style = { paddingTop: '100px' }
      if (this.isFullPage) {
        style.paddingTop = '60px'
      }
      return style
    },
    getContentBoxStyle: function () {
      let style = {}
      if (this.isFullPage) {
        style.paddingBottom = '0px'
      }
      return style
    },
    getContentRouterStyle: function () {
      let style = {}
      if (this.isFullPage) {
        style.padding = '0px'
      }
      return style
    },
    delTabMenu: function (menu) {
      this.setNewPageName({pageName: menu.code})
    }
  },
  // beforeRouteEnter
  beforeRouteUpdate: function (to, from, next) {
    let pageIsNew = to.params.isNew
    let pageName = to.name

    // if (!this.isAuthMenu) {
    //   // this.warning('当前用户无此页面访问权限')
    //   next({
    //     path: '/authority/otherSite'
    //   })
    // }

    this.pageName = pageName

    if (pageIsNew) {
      this.setNewPageName({pageName: pageName})
      // 这样才能 destroy 缓存的页面组件
      this.$nextTick(() => {
        next()
      })
    } else {
      next()
    }
  },
  created: function () {
    const { name } = this.$route
    this.pageName = name
    // if (!this.isAuthMenu) {
    //   this.warning('当前用户无此页面访问权限')
    //   this.$router.push({path: '/authority/otherSite'})
    // }
  },
  updated: function () {
  }
}
</script>

<style lang="scss" scoped>
.main{
  padding-left: $sider-width;
  position: relative;
  width: 100%;
  height: 100%;
  transition: padding 0.3s;

  .side-menu{
    width: $sider-width;
    height: 100%;
    position: absolute;
    padding-top: 60px;
    left: 0;
    bottom: 0;
    transition: transform 0.3s;
    transform-origin: left;
    background-color: #001529;

    img{
      box-sizing: border-box;
      position: absolute;
      z-index: 1;
      width: 240px;
      top: 0px;
      left: 0px;
    }
    .menu-wrap{
      height: 95%;
      width: 100%;
      .el-scrollbar /deep/{
        height: 100%;
        .el-scrollbar__wrap{
          overflow-x: hidden;
        }
      }
    }
  }

  .content-warp{
    height: 100%;
    position: relative;
    background-color: #F0F2F5;

    .content-box{
      height: 100%;
      padding: 0 0 10px;
      .el-scrollbar /deep/{
        height: 100%;
        width: 100%;
        .el-scrollbar__wrap{
          overflow-x: hidden;
          height: 100%;
          .el-scrollbar__view{
            height: 100%;
          }
        }
      }
      .content-router{
        padding: 0 15px;
        height: 100%;
      }
    }
  }
}
</style>
