<template>
  <div v-loading="pageLoading">
    <!-- <div class="head">
      <div class="content">
        <img src="../assets/images/logo.png" />
      </div>
    </div> -->
    <div class="wrapper">
      <div class="main">
        <div class="main-box">
          <p>EasyWorkSystem</p>
          <div class="user-box">
            <b>用户名</b>
            <input type="text" placeholder="请输入用户名" v-model="username" @input="setUsername(username)" class="user" />
          </div>
          <div class="user-box">
            <b>密码</b>
            <input :type="passwordType" placeholder="请输入密码" v-model="password" @input="setPassword(password)" class="user" />
            <i class="icon-hidden" v-if="passwordType === 'text'" @click="passwordType = 'password'"></i>
            <i class="icon-show" v-if="passwordType === 'password'" @click="passwordType = 'text'"></i>
          </div>
          <div class="help">
 
          </div>
          <el-button type="primary" class="login" @click="login" :loading="isLogining">登 录</el-button>
        </div>
      </div>
    </div>
    <!-- <p class="bottom-text">{{copyright}}</p> -->
  </div>
</template>

<script>
import { WebsiteConf } from '@/config'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      pageLoading: false,
      i18nLocale: '',
      defaultuser: this.$storage.get('username'),
      websitename: WebsiteConf.webname,
      copyright: WebsiteConf.copyright,
      checked: false,
      username: null,
      password: null,
      passwordType: 'password'
    };
  },
  components: {},
  computed: {
    ...mapState({
      loginErrorMsg: state => state.user.loginErrorMsg,
      isLogining: state => state.user.isLogining
    })
  },
  watch: {},
  methods: {
    ...mapActions('user', ['doLogin', 'setUsername', 'setPassword']),

    login: function () {
      this.doLogin({
        that: this,
        username: this.username,
        password: this.password
      })
    },
    changeUser: function () {
      this.defaultuser = null
      this.setUsername(null)
    },
    handleKeyDown: function (e) {
      let key = window.event.keyCode
      if (key == 13) {
        this.login()
      }
    }
  },
  created: function () {
    document.addEventListener('keydown', this.handleKeyDown)
  },
  mounted: function () {
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
};
</script>

<style lang="scss" scoped>
.head .content {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 50px;
  background: #fff;
  img {
    height: 28px;
    margin: 20px 0;
  }
}
.wrapper {
  background-image: url(../assets/images/bg-login.jpg);
  background-position: top center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper .main {
  background-image: url(../assets/images/bg-user-box.png);
  background-position: top left;
  background-size: auto 100%;
  width: 1050px;
  background-color: #fff;
  height: 580px;
}
.wrapper .main img {
  margin-top: 100px;
  margin-left: 60px;
  width: 500px;
}
.wrapper .main .main-box {
  width: 500px;
  height: 480px;
  background: #fff;
  margin-left: 535px;
  border-radius: 10px;
  padding: 0 80px;
}
.wrapper .main .main-box p {
  text-align: center;
  margin-top: 75px;
  margin-bottom: 45px;
  font-size: 32px;
  font-weight: bold;
  color: $black;
}

.wrapper .main .main-box label i {
  position: absolute;
  left: 10px;
  font-size: 16px;
  top: 7px;
  color: #242247;
}
.wrapper .main .main-box .hint {
  text-align: right;
  font-size: 10px;
  color: white;
}
.wrapper .main .main-box .login {
  width: 100%;
  line-height: 20px;
  display: block;
  margin: 0 auto;
  font-size: 16px;
  font-weight: bolder;
  color: white;
}
.wrapper .main .main-box .help /deep/ {
  height: 20px;
  padding-bottom: 70px;
  padding-top: 20px;
  font-size: 14px;
  .el-checkbox__label {
    font-size: 14px;
    color: #999;
  }
}
.wrapper .main .main-box .help a {
  color: #999;
  font-size: 14px;
  float: right;
}
.wrapper .main .main-box .msg {
  font-size: 14px;
  color: #999;
}
p.bottom-text {
  width: 500px;
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
  color: #999;
  font-size: 14px;
}

.user-box {
  position: relative;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  .icon-hidden,.icon-show{
    position: absolute;
    z-index: 5;
    width: 18px;
    height: 40px;
    bottom: 0;
    right: 12px;
    background-size: 100%;
    cursor: pointer;
  }
  .icon-hidden::after {
    content: '';
    position: absolute;
    background-image: url(../assets/images/menu_hidden.png); /*引入图片图片*/
    background-repeat: no-repeat;
    background-size: contain;
    width: 18px;
    height: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
  .icon-show::after {
    content: '';
    position: absolute;
    background-image: url(../assets/images/menu_show.png); /*引入图片图片*/
    background-repeat: no-repeat;
    background-size: contain;
    width: 15px;
    height: 11px;
    top: 50%;
    transform: translateY(-50%);
  }
  b {
    color: black;
    font-size: 18px;
    display: inline-block;
    margin: 0 0 10px 0;
  }
}
.user {
  width: 100%;
  line-height: 40px;
  text-indent: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px #999 solid;
  &:focus {
    border: 1px #7336fe solid;
  }
}
input::-webkit-input-placeholder {
  color: #999999;
}
.title {
  font-size: 28px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 182, 0, 1);
  line-height: 40px;
}
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #ffffffff inset; //我这里的body背景色是#f8f8f8f
}
</style>
