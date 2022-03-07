/**
 * 内容界面tab页签组件
 * 使用vuex管理状态 通过全局注册的menuOpen方法可打开新页签
 * menuOpen已存在的页面时，不新开页签，替换原页签的params
 * tab过多时切换效果（已完成）
 * tab切换时保留页面状态（已完成）
 */
<template>
  <div ref="page-tab-wrap" class="page-menu-tab-wrap">
    <div v-show="isPageTabHidden" @click="scrollLeft" class="tab-btn last"><i class="el-icon-caret-left"></i></div>
    <div v-show="isPageTabHidden" @click="scrollRight" class="tab-btn next"><i class="el-icon-caret-right"></i></div>
    <div ref="page-tab" class="page-tab" :class="isPageTabHidden ? 'hidden':''" @contextmenu.prevent @mousewheel="onMenuMouseWheel">
      <div class="menu-warp">
        <div ref="menu-content" class="menu-content" :style="{transform: 'translate('+-1*pageTabScrollLeft+'px,0)'}">
          <draggable :list="menuTabList" :animation="150" :no-transition-on-drag="true" style="display:inline-block">
            <!-- <transition-group name="list"> -->
              <div class="menu" :ref="'menu'+menu.code" v-for="menu in menuTabList" :key="menu.code" :class="menu.code === menuTabSeled.code ? 'seled':''" @click="menuClick(menu)" @contextmenu.prevent="tabRightClick($event, menu)">
                <i class="el-icon-loading" v-show="loadingPageName === menu.code"></i>
                {{menu.name}}
                <i class="el-icon-close" @click.stop="deleteTab(menu)" v-show="menuTabList.length > 1 || menuTabList[0].code != mainPageCode"></i>
              </div>
            <!-- </transition-group> -->
          </draggable>
        </div>
      </div>
    </div>
    <div class="tab-menu" v-if="rightMenu.show" :style="rightMenuStyle" @contextmenu.prevent>
      <ul>
        <li @click="closeMenu('refresh')">刷新</li>
        <li @click="closeMenu('left')">关闭左边</li>
        <li @click="closeMenu('right')">关闭右边</li>
        <li @click="closeMenu('other')">关闭其他</li>
      </ul>
    </div>
  </div>
</template>
<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import draggable from 'vuedraggable'

export default {
  inject: ['handleDelTabMenu'],
  name: 'page-menu-tab',
  components: {draggable},
  data () {
    return {
      // 默认首页code
      mainPageCode: 'mainIndex',
      // 是否收起状态
      isPageTabHidden: true,
      // 更新前数组长度
      lastMenuListLength: 1,
      // pageTab 外框宽度
      pageTabBoxWidth: 0,
      // pageTab 内容宽度
      pageTabContentWidth: 0,
      // 滑动步长
      pageTabScrollStep: 300,
      // 滑动距离
      pageTabScrollLeft: 0,
      // 右键菜单状态参数
      rightMenu: {
        show: false,
        transform: 'scaleY(0.1)',
        opacity: 0,
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    ...mapState({
      loadingPageName: state => state.common.loadingPageName
    }),
    ...mapGetters('menu', ['menuTabList', 'menuTabSeled']),
    rightMenuStyle: function () {
      const style = {}
      let left = this.rightMenu.left - this.pageTabScrollLeft + 10
      if (this.isPageTabHidden) left += 20
      style.transform = this.rightMenu.transform
      style.opacity = this.rightMenu.opacity
      style.left = left + 'px'
      style.top = this.rightMenu.top + 'px'
      return style
    }
  },
  watch: {
    // 用watch里面的oldvalue获取有bug，所以改成lastMenuListLength存取
    menuTabList: function (list) {
      if (list.length === this.lastMenuListLength) {
        this.setMenuTabListId()
      } else {
        this.$nextTick(() => {
          this.checkPageTabWidth()
        })
      }
      this.lastMenuListLength = list.length
    },
    menuTabSeled: function (menu) {
      this.menuTurn(menu)
      this.$nextTick(() => {
        this.checkMenuInShowView(menu)
      })
    }
  },
  methods: {
    ...mapMutations('menu', ['delTabMenu', 'setTabMenu', 'setTabMenuList', 'clearTabMenu', 'clearTabMenuList', 'closeSideTabMenuList', 'setMenuTabListId']),
    menuClick: function (menu) {
      if (this.menuTabSeled.code === menu.code) {
        this.checkMenuInShowView(menu)
        return
      }
      menu.isNew = false
      this.setTabMenu(menu)
    },
    deleteTab: function (menu) {
      this.delTabMenu(menu)
      this.handleDelTabMenu(menu)
    },
    // 检查 pageTab 宽度，判断是否切换到收起状态
    checkPageTabWidth: function () {
      let pageTab = this.$refs['page-tab']
      let content = this.$refs['menu-content']
      let realBoxWidth = this.isPageTabHidden ? pageTab.clientWidth + 30 : pageTab.clientWidth

      // 当menuTab组件整个隐藏时，直接终止计算
      if (realBoxWidth === 0 && content.clientWidth === 0) return
      if (realBoxWidth < content.clientWidth) {
        this.isPageTabHidden = true
      } else {
        this.isPageTabHidden = false
        this.pageTabScrollLeft = 0
      }

      this.$nextTick(() => {
        this.pageTabBoxWidth = pageTab.clientWidth
        this.pageTabContentWidth = content.clientWidth
        if (this.isPageTabHidden && (this.pageTabScrollLeft + this.pageTabBoxWidth) > this.pageTabContentWidth) {
          this.pageTabScrollLeft = this.pageTabContentWidth - this.pageTabBoxWidth
        }
      })
    },
    // 向左滑
    scrollLeft: function () {
      if (this.pageTabContentWidth <= this.pageTabBoxWidth) return
      this.pageTabScrollLeft = Math.max(this.pageTabScrollLeft - this.pageTabScrollStep, 0)
    },
    // 向右滑
    scrollRight: function () {
      if (this.pageTabContentWidth <= this.pageTabBoxWidth) return
      this.pageTabScrollLeft = Math.min(this.pageTabScrollLeft + this.pageTabScrollStep, this.pageTabContentWidth - this.pageTabBoxWidth)
    },
    //
    onMenuMouseWheel: function (e) {
      const { deltaY } = e
      const turnRight = deltaY > 0
      if (turnRight) {
        this.scrollRight()
      } else {
        this.scrollLeft()
      }
    },
    // 判断菜单 tab 是否在可见范围内,如果不是则配置 pageTabScrollLeft
    checkMenuInShowView: function (menu) {
      if (!this.$refs['menu' + menu.code]) return
      let dom = this.$refs['menu' + menu.code][0]
      let width = dom.clientWidth
      let left = dom.offsetLeft
      if (left < this.pageTabScrollLeft) {
        this.pageTabScrollLeft = left
        return true
      }
      if ((left + width) > (this.pageTabScrollLeft + this.pageTabBoxWidth)) {
        this.pageTabScrollLeft = left + width - this.pageTabBoxWidth + 2
        return true
      }
    },
    // 关闭tab方法: self\other\all
    closeMenu: function (type) {
      if (type === 'self') {
        this.menuClose()
      } else if (type === 'other') {
        this.menuTabSeled.id = 1
        this.setTabMenuList([this.menuTabSeled])
      } else if (type === 'refresh') {
        this.menuRefresh()
      } else if (type === 'left') {
        this.closeSideTabMenuList('left')
      } else if (type === 'right') {
        this.closeSideTabMenuList('right')
      } else if (type === 'all') {
        this.clearTabMenu()
        this.clearTabMenuList()
      }
    },
    // 鼠标右键事件处理
    tabRightClick: function (event, menu) {
      let {offsetX, offsetY, target} = event
      if (target.nodeName === 'svg') return
      let left = offsetX + target.offsetLeft
      let top = offsetY

      this.menuClick(menu)
      this.showRightMenu({left, top})
    },
    // 显示右键菜单
    showRightMenu: function ({left, top}) {
      this.rightMenu.show = true
      setTimeout(() => {
        this.rightMenu.transform = 'scaleY(1)'
        this.rightMenu.opacity = 1
        this.rightMenu.left = left + 10
        this.rightMenu.top = top + 10
      }, 1)

      window.addEventListener('click', this.hideRightMenuListener)
    },
    // 隐藏右键菜单
    hideRightMenu: function () {
      this.rightMenu.transform = 'scaleY(0.1)'
      this.rightMenu.opacity = 0

      setTimeout(() => {
        this.rightMenu.show = false
      }, 200)
    },
    // 隐藏右键菜单监听事件
    hideRightMenuListener: function () {
      this.hideRightMenu()
      window.removeEventListener('click', this.hideRightMenuListener)
    }
  },
  mounted: function () {
    this.checkPageTabWidth()
    window.addEventListener('resize', this.checkPageTabWidth)
  },
  destroyed: function () {
    window.removeEventListener('click', this.hideRightMenuListener)
    window.removeEventListener('resize', this.checkPageTabWidth)
  }
}
</script>
<style lang="scss" scoped>
.list-leave-active {
  transition: all 1s;
}
.page-menu-tab-wrap{
  user-select: none;
  position: absolute;
  top: 60px;
  width: 100%;
  box-sizing: border-box;
  height: $header-sub-height;
}
.tab-btn{
  position: absolute;
  width: 30px;
  height: $header-sub-height;
  line-height: $header-sub-height;
  text-align: center;
  top: 0;
  font-size: 16px;
  cursor: pointer;
  &.last{
    left: 0px;
  }
  &.next{
    right: 0px;
  }
  &:hover{
    /* background-color: #e6f2f9; */
    color: $color;
  }
}
.page-tab{
  height: $header-sub-height;
  position: absolute;
  top: 0;
  left: 15px;
  right: 15px;
  overflow: hidden;
  &.hidden{
    left: 30px;
    right: 30px;
  }
  .menu-warp{
    width: 10000px;
    position: relative;
  }
  .menu-content{
    position: absolute;
    display: inline-block;
    transition: transform 0.5s;
    width: auto;
  }
  .menu{
    // cursor: pointer;
    font-size: $page-tab-font-size;
    height: $header-sub-height;
    line-height: $header-sub-height - 4px;
    color: $black-level6;
    border-top: 3px solid #f0f2f5;
    padding: 0 32px 0 16px;
    float: left;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease-in-out;
    &:hover{
      text-shadow: 1px 1px 1px #ddd;
      background-color: #f3f5f8;

      .el-icon-close{
        right: 4px;
      }
    }
    &.seled{
      border-color: $color;
      // border-left: 1px solid #fff;
      // border-right: 1px solid #fff;
      background-color: #fff;
      color: $black-level5;
    }

    .el-icon-close{
      position: absolute;
      right: -18px;
      cursor: pointer;
      padding: 4px;
      font-size: $page-tab-icon-size;
      border-radius: 6px;
      top: ($header-sub-height - $page-tab-icon-size - 8)/2 - 2px;

      &:hover{
        background: $black-level9;
      }
    }
  }
}

.tab-menu{
  position: absolute;
  background-color: #fff;
  border: 1px solid #EBEEF5;
  border-radius: 2px;
  padding: 10px 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  z-index: 10;
  transition: opacity 0.25s ease,transform 0.25s ease;
  transform-origin: top;
  z-index: 100;
  ul{
    list-style: none;
    line-height: 36px;
    font-size: 12px;

    li{
      padding: 0 15px;
      cursor: pointer;
      color: $black-level4;

      &:hover{
        background-color: $color-back;
        color: $color;
      }
    }
  }
}
</style>
