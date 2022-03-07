<template>
  <div v-loading="pageLoading" style="height: 100%; overflow: auto">
    <div class="head">
      <div class="content">
        <img src="../assets/images/logo_ac.png" />
      </div>
    </div>
    <div class="wrapper">
      <div class="main">
        <img src="../assets/images/login_img.png">
        <div v-if="apiSuccess" class="message-box">
          正在跳转到登陆页面...
        </div>
        <div v-if="errorData" class="error-box">
          {{errorData}}
        </div>
      </div>
    </div>
    <div class="footer">
      <div style="width:300px;margin:0 auto; padding:20px 0;">
		 		<!-- <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=XXXXXXXXXXXXX" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">沪公网安备 XXXXXXXXXXXXX号</p></a> -->
		 	</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiSuccess: false,
      pageLoading: false,
      errorData: null
    }
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    // 获取sso跳转链接
    GetSSOTurnUrl: async function () {
      this.pageLoading = true
      // 获取sso跳转链接
      // await this.$api.query(this.$api.auth.aad).then(({res}) => {
      //   if (typeof res === 'string') {
      //     this.apiSuccess = true
      //     this.$nextTick(() => {
      //       window.location.href = res
      //     })
      //   }
      // }, (error) => {
      //   if (error && error.response) {
      //     this.errorData = error.response.data
      //   }
      // })
      this.pageLoading = false
    }
  },
  created: function () {},
  mounted: function () {
    this.GetSSOTurnUrl()
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
  background-image: url(../assets/images/bg.png);
  background-position: center;
  background-size: cover;
  margin: 0 auto;
  width: 100% auto;
  min-height: 700px;
}
.wrapper .main {
  width: 1200px;
  margin: 0 auto;
  min-height: 600px;
  overflow: auto;
  padding-bottom: 100px;

  img {
    margin-top: 100px;
    margin-left: 60px;
    width: 500px;
  }

  .message-box{
    background: rgba(255,255,255,0.4);
    color: #333;
    border-radius: 12px;
    width: 550px;
    float: right;
    margin-top: 60px;
    padding: 100px 20px;
    font-size: 18px;
    text-align: center;
  }

  .error-box{
    background: #fff;
    border-radius: 12px;
    width: 550px;
    float: right;
    margin-top: 60px;
    padding: 20px;
    word-wrap:break-word;
  }
}
.footer{
  color: #666;
  font-size: 12px;
  margin: 20px auto;
  text-align: center;
  line-height: 24px;
  a{
    color: #333;
  }
}
</style>
