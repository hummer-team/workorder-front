<template>
  <div class="bread-line" v-show="breadShow">
    <i class="el-icon-location-outline"></i>
    <span v-if="menuSeled.level_1.code"><i :class="'el-icon-'+menuSeled.level_1.icon"></i>{{menuSeled.level_1.name}}</span>
    <span v-if="menuSeled.level_2.code"><span class="separator">{{separator}}</span> {{menuSeled.level_2.name}}</span>
    <span v-if="menuSeled.level_3.code"><span class="separator">{{separator}}</span> {{menuSeled.level_3.name}}</span>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'bread-crumbs',
  data () {
    return {
      separator: '\\'
    }
  },
  components: {},
  computed : {
    ...mapState({
      breadShow: state => state.common.breadShow,
      menuSeled: state => state.common.menuSeled
    })
  },
  methods: {

  },
  created: function (){
    
  },
  mounted: function () {
    
  }
}
</script>

<style lang="scss" scoped>
div.bread-line{
  height: 60px;
  line-height: 30px;
  font-size: 12px;
  padding: 15px 20px;
  color: #666;
  z-index: 10;
  position: absolute;
  width: 100%;
  top: 60px;

  .el-icon-location-outline{
    font-size: 14px;
  }

  >span{
  	color:#999;
  	font-size:14px;
  	i{text-indent:0;margin-right:2px;}

  	.separator{
  		margin:0 6px;
  		font-size:12px;
  		color:#aaa
  	}
  }
}
</style>
