<template>
  <ul class="menu_index_1">
    <li v-for="(menu1, index1) in menuTree.filter(m => m.type === 1 && (m.isShow === '1') && m.roles.includes(role))" :key="index1">
      <a href="javascript:;" @click="menuClick(menu1, 1)" :class="getLevel1Class(menu1)">
        <!-- <img :src="menu1.icon" v-if="menu1.icon" class="in-middle" />
        <i v:class="'fa fa-' + menu1.icon" :style="{fontSize: menu1.iconSize + 'px'}"  v-else ></i> -->
        <i class="el-icon-folder"></i>
        <span style="vertical-align:middle">{{menu1.name}}</span>
      </a>
      <ul v-if="menu1.child && menu1.isShow" class="menu_index_2" :style="getLevel2WrapStyle(menu1)">
        <li v-for="(menu2, index2) in menu1.child.filter(m => m.type === 1 && (m.isShow === '1'))" :key="index2">
          <a href="javascript:;" v-if="menu2.roles.includes(role)" @click="menuClick(menu2, 2)" :class="getLevel2Class(menu2)">
            <i v-if="menu2.child" class="el-icon-folder"></i>
            <i v-else class="el-icon-document"></i>
            <span>{{menu2.name}}</span>
          </a>
          <ul v-if="menu2.child" class="menu_index_3" :style="getLevel3WrapStyle(menu2)">
            <li v-for="(menu3, index3) in menu2.child.filter(m => m.type === 1 && (m.isShow === '1') ) " :key="index3">
              <a href="javascript:;" @click="menuClick(menu3, 3)" :class="getLevel3Class(menu3)">
                <i v-if="menu2.child" class="el-icon-document"></i>
                <span>{{menu3.name}}</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
// import { menuTree } from '@/config/menu'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'side-menu',
  data () {
    return {
      lastSelectMenuTree: [],
      // 一级菜单展开项
      menuOpenedLevel1: '',
      // 二级菜单展开项
      menuOpenedLevel2: '',
      // 当前选中菜单
      menuSelectCode: '',
      menuTree: [
        {
          child: [{ code: 'workorderDetail', name: '创建工单', type: 1, isShow: '1', roles: [0, 3] }, { code: 'workorderDetail', name: '工单详情', type: 1, isShow: '0' }, { code: 'workorderList', name: '工单列表', type: 1, isShow: '1', roles: [0, 1, 2, 3, 4] }, { code: 'pendingApprovalWorkorderList', name: '待审批工单', type: 1, isShow: '1', roles: [0, 1, 3] }, { code: 'pendingExecuteWorkorderList', name: '待执行工单', type: 1, isShow: '1', roles: [0, 2, 3] }],
          code: 'workorderManagement',
          isShow: '1',
          type: 1,
          roles: [0, 1, 2, 3, 4],
          name: '工单管理'
        },
        {
          child: [{ code: 'userDetail', name: '用户详情', type: 1, isShow: '0' }, { code: 'userList', name: '用户列表', type: 1, isShow: '1', roles: [3] }],
          code: 'userManagement',
          isShow: '1',
          type: 1,
          roles: [3],
          name: '用户管理'
        },
        {
          child: [{ code: 'templateDetail', name: '模板详情', type: 1, isShow: '0' }, { code: 'templateList', name: '模板列表', type: 1, isShow: '1', roles: [3] }],
          code: 'templateManagement',
          isShow: '1',
          type: 1,
          roles: [3],
          name: '模板管理'
        }
      ]
    }
  },
  props: {
    menuSelect: { type: Object, default: () => { return {} } }
  },
  computed : {
    ...mapGetters('menu', ['menuTabList', 'menuTabSeled']),
    ...mapState({
      menuTreeList: state => state.user.menusTree,
      currentsiteId: state => state.user.currentsiteId,
      currentTree: state => state.user.currentTree || [],
      role: state => state.user.role
    }),
    // menuTree: function () {
    //   if (this.currentTree.length > 0) return this.currentTree
    //   if (!this.menuTreeList) return []
    //   for (let i = 0 ; i < this.menuTreeList.length; i++) {
    //     if (localStorage.getItem('siteId') === this.menuTreeList[i].siteRefData.siteId  ) {
    //       return this.menuTreeList[i].menuDatas
    //     }
    //   }
    // }
  },
  methods:{
    ...mapActions('user', ['getMenusTreeandSiteIds']),
    // 菜单组件初始化数据
    setMenuInit: async function () {
      // 根据当前站点名匹配到对应的菜单树 siteId
      if (!this.menuTreeList) {
        this.lastSelectMenuTree = []
        return
      }
      this.menuTreeList.forEach(item => {
        if (localStorage.getItem('siteId') === item.siteRefData.siteId  ) {
          this.lastSelectMenuTree = item.menuDatas
        }
      })
    },
    // 菜单点击事件
    menuClick: function (menu = {}, level) {
      const openedLevel = 'menuOpenedLevel' + level
      if (menu.child && menu.child.length > 0 && menu.child.some(c => c.type !== 2)) {  // 如果child 没有一个按钮资源则...
        if (this[openedLevel] === menu.code) {
          this[openedLevel] = ''
        } else {
          this[openedLevel] = menu.code
        }
      } else {
        if (this.menuSelectCode === menu.code && this.menuTabSeled.code === menu.code) {
          this.menuRefresh()
          return
        }
        this.menuSelectCode = menu.code
        // let menuBtnList = menu.child && menu.child.filter(b => b.type === 2).map(i => i.code).join()
        this.menuOpen({name: menu.code , query: {}})
      }
    },
    // 获取一级菜单行 class
    getLevel1Class: function (menu) {
      if (menu.code === this.menuOpenedLevel1) return 'opened'
      if (menu.code === this.menuSelectCode) return 'seled'
      return ''
    },
    // 获取二级菜单行 class
    getLevel2Class: function (menu) {
      if (menu.code === this.menuOpenedLevel2) return 'opened'
      if (menu.code === this.menuSelectCode) return 'seled'
      return ''
    },
    // 获取三级菜单行 class
    getLevel3Class: function (menu) {
      if (menu.code === this.menuSelectCode) return 'seled'
      return ''
    },
    // 获取二级菜单列表 style
    getLevel2WrapStyle: function (menu) {
      // menu.child = menu.child.filter(m => m.type === 1)
      const style = { height: 0 }
      const menuShowChild = menu.child.filter(m => m.type === 1)
      if (this.menuOpenedLevel1 === menu.code) {
        style.height = menuShowChild.filter(m => m.type === 1 && (m.isShow === '1') && m.roles.includes(this.role)).length * 44 + 20
        let menuChild = menuShowChild.find(v => v.code === this.menuOpenedLevel2)
        if (menuChild) {
          let menuShowChildChild = menuChild.child ? menuChild.child.filter(m => m.type === 1 && (m.isShow === '1')) : []
          if (this.menuOpenedLevel2 && menuShowChildChild.length) {
            style.height += menuShowChildChild.length * 40 + 20
          }
        }
      }
      style.height += 'px'
      return style
    },
    // 获取三级菜单列表 style
    getLevel3WrapStyle: function (menu) {
      const style = { height: 0 }
      if (this.menuOpenedLevel2 === menu.code) {
        style.height = menu.child.filter(m => m.type === 1 && m.isShow === '1').length * 40 + 20
      }
      style.height += 'px'
      return style
    }
  },
  created: function () {

  },
  mounted: function () {
    // this.setMenuInit()
  }
}
</script>

<style lang="scss" scoped>
ul{
  width: 100%;
  overflow: hidden;

  a{
    display: inline-block;
    color: #888;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    display: inline-block;
    width: 100%;
    position: relative;

    &:before{
      content: '';
      display: none;
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.05);
    }

    &:hover:before{
      display: block;
    }

    &:active{
      transform: translate(1px, 1px);
    }

    &.opened{
      color: #f0f0f0;
      background-color: #000C17;
    }
    &.seled{
      color: #f0f0f0;
      background-color: #101C27;

      &:after{
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 5px;
        height: 100%;
        background-color: $color;
      }
    }
  }

  &.menu_index_1{
    background-color: #001529;
    a{
      padding-left: 30px;
      i{
        font-size: 16px;
        margin-right: 6px;
        width: 20px;
        text-align: center;
      }
    }
  }

  &.menu_index_2{
    background-color: #000c17;
    transition: all 0.3s ease;
    transform-origin: top;
    li:first-child{
      margin-top: 10px;
    }
    a{
      padding-left: 45px;
      height: 44px;
      line-height: 44px;
      &.opened{
        background-color: #06131c;
      }
    }
  }

  &.menu_index_3{
    background-color: #06131c;
    transition: all 0.3s ease;
    transform-origin: top;
    li:first-child{
      margin-top: 10px;
    }
    a{
      padding-left: 55px;
      height: 40px;
      line-height: 40px;
    }
  }
}
.in-middle {
  display: inline-block;
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
