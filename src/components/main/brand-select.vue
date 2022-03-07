<template>
  <div class="brand-wrap">
    <el-form ref="form" :model="form" label-width="0px">
      <el-form-item label="">
        <el-select v-model="siteId" placeholder="请选择品牌" @change="changeBrand">
          <el-option v-for="brand in brandList" :key="brand.value" :label="brand.label" :value="brand.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'

export default {
  inject: ['reload'],
  name:'bread-crumbs',
  data () {
    return {
      form: {},
      siteId: localStorage.getItem('siteId') ,//,
      lastSiteId: '',
      defaultSite: '',
      brandList: []
    }
  },
  computed: {
    ...mapState('user', ['loginid']),
    // ...mapGetters('user', [
    //   'brandSiteList'
    // ]),
  },
  watch:{},
  methods:{
    ...mapMutations('menu', ['clearTabMenu', 'clearTabMenuList']),
    setSiteId: function () { // 该方法主要是拿默认值赋给当前站点
      let brList = this.brandList.map(brand => brand.value)
      if (!this.siteId || brList.indexOf(this.siteId) < 0) {
        this.siteId = this.defaultSite
        this.lastSiteId = this.defaultSite
      }
    },
    changeBrand: function (newSiteId) { // 切换品牌 commit设置当前站点
      // this.siteId = this.lastSiteId
      // this.$confirm('此操作将切换品牌, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.siteId = newSiteId
      //   this.lastSiteId = newSiteId
      //   this.$store.commit("user/setCurrentSite", newSiteId);
      //   let router = this.$route
      //   // if (router.name === 'mainIndex') {
      //   this.clearTabMenu()
      //   this.clearTabMenuList()
      //   window.location.reload()
      //   //   this.reload()
      //   // } else {
      //   //   this.pageTurn('/main/index')
      //   // }
      // }).catch(() => {})
    }
  },
  created: function () {
    // const siteList = this.$storage.get('loginid') === 'admin' ? this.getSiteEnum() : this.brandSiteList
    // const siteList = this.brandSiteList
    // this.brandList = []
    // siteList.forEach(site => {
    //   let value = site.siteId || site.code
    //   let label = site.siteName || site.name
    //   if (site.siteName === '基础运营平台' && this.loginid === 'SupperAdmin') {
    //     this.defaultSite = value
    //     this.$store.commit("user/setCurrentSite", value);
    //   }
    //   this.brandList.push({label, value})
    // })
  },
  mounted: function () {
    this.setSiteId()
  }
}
</script>

<style lang="scss" scoped>
.brand-wrap /deep/{
  float: left;
  margin-left: 10px;
  padding-top: 0px;
  width: 180px;

  .el-form-item__label{
    font-size: 13px;
  }

  .el-form-item .el-form-item__content .el-input__inner{
    line-height: 58px;
    height: 58px;
    text-align: center;
    font-size: 16px;
    font-weight: bolder;
    border-color: $color;
    font-family: segoeui,"Microsoft Yahei";
    border: 0;
    color: $color;
  }

  .el-select .el-input .el-select__caret{
    color: $color;
  }

  .el-form-item .el-form-item__content .el-input__inner{
    text-align: left;
    padding-left: 0;
  }
}
</style>
