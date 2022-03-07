<template>
  <div class="userbox">
    <div>{{`${date} ${week}`}}</div>
    <el-dropdown trigger="click" @command="handleMenuCommand">
      <div class="user-box"><i class="fa fa-user-circle-o"></i>{{username}}</div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="loginOut" icon="el-icon-user">登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      week: '',
      date: ''
    }
  },
  computed:{
    ...mapState({
      username: state => state.user.username,
      loginid: state => state.user.loginid,
      token: state => state.user.token
    })
  },
  watch:{
  },
  methods:{
    ...mapMutations('menu', ['clearTabMenu', 'clearTabMenuList']),
    ...mapActions('user', ['doLoginOut']),
    handleMenuCommand: function (command) {
      if (command === 'loginOut') {
        this.loginOut()
      }
    },
    loginOut: async function () {
      let result = await this.confirm('确认登出？')
      if (result === 'confirm') {
        this.clearTabMenu()
        this.clearTabMenuList()
        this.doLoginOut(this)
      }
    }
  },
  mounted () {
    const now = new Date()
    const date = this.$format.format.date(now)
    const day = now.getDay()
    const weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
    const week = weeks[day]
    this.week = week
    this.date = date
  }
}
</script>

<style lang="scss" scoped>
div.userbox{
  text-indent: 0;
  display: flex;
  position: relative;
  align-items: center;
  .user-box{
    color:#333;
    font-size:14px;
    border-radius:6px;
    padding:10px 16px;
    line-height: 20px;
    cursor:pointer;

    &:hover{
      background-color:#f4f4f4;
    }
    &.seled{
      background-color:#eee;
    }
    i{
      margin-right:6px;
      font-size: 18px;
    }
  }
  >ul{
    border-radius:10px;
    padding:6px;
    position:absolute;
    top:36px;
    right:0;
    width:140px;
    border:1px solid #eee;
    background-color:#fff;
    box-shadow:2px 2px 3px rgba(0,0,0,0.2);
    z-index:100;
    li{
      display:block;
      width:100%;
      line-height:36px;
      border-radius:6px;
      cursor:pointer;
      &:hover{background-color:#f0f6f6;color:#00969e;}
      i{font-size:12px;margin:0 10px;}
    }
  }
}
</style>
