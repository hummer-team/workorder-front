/*
*  @ 全局时间线组件
*/
<template>
  <div class="default-timeline">
    <!-- <el-radio-group class="sort-radio" v-model="reverse">
      <el-radio :label="true">倒序</el-radio>
      <el-radio :label="false">正序</el-radio>
    </el-radio-group> -->
    <el-timeline :reverse="reverse">
      <el-timeline-item class="timeline-item" v-for="(timeline, itemIndex) in logs" :timestamp="timeline[timestampField]" :key="itemIndex" :hide-timestamp="hideTimestamp" :placement="placement" :type="timestampType" :size="timestampSize" :icon="timeline.icon" :color="timeline.color">
        <span v-html="timeline.content"></span>
        <!-- <i v-if="activeTimeline[itemIndex]" class="el-icon-caret-bottom" @click="hideTimeline(itemIndex)"></i>
        <i v-else class="el-icon-caret-right" @click="showTimeline(itemIndex)"></i> -->
        <!-- <el-collapse-transition>
          <div v-show="activeTimeline[itemIndex]">
            <el-card class="card" v-for="(log, index) in timeline.logs" :shadow="cardShadow" :body-style="cardBodyStyle" :key="index">
              <span>{{log.text}}</span>
            </el-card>
          </div>
        </el-collapse-transition> -->
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTimeline: [],
      reverse: false
    }
  },
  props: {
    // 日志数据
    logs: { type: Array, default: () => { return [] } },
    // 日志时间戳对应字段
    timestampField: { type: String, default: '' },
    // 是否隐藏时间戳
    hideTimestamp: { type: Boolean, default: false },
    // 时间戳位置
    placement: { type: String, default: 'top' },
    // 节点类型
    timestampType: { type: String, default: '' },
    // 节点尺寸
    timestampSize: { type: String, default: 'large' },
    // 时间线组件卡片阴影类型 always / hover / never
    cardShadow: { type: String, default: 'always' },
    // 时间线组件卡片body样式
    cardBodyStyle: { type: String, default: '' },
    // 是否显示详情按钮
    showDetail: { type: Boolean, default: true }
  },
  methods: {
    dataInit: function () {
      // 初始化timeline展示情况
      for (let i = 0; i < this.logs.length; i++) {
        this.activeTimeline.push(1)
      }
    },
    // 打开日志详情弹窗
    showLogDetail: function (log) {
      this.$emit('openDialog', log.tableData)
    },
    // 隐藏timeline
    hideTimeline: function (index) {
      this.activeTimeline.splice(index, 1, 0)
    },
    // 显示timeline
    showTimeline: function (index) {
      this.activeTimeline.splice(index, 1, 1)
    }
  },
  created () {
    this.dataInit()
  }
}
</script>

<style lang="scss" scoped>
.default-timeline{

  >>> .el-timeline-item__node--large{
    left: -7px;
    top: -5px;
    width: 24px;
    height: 24px;
  }
  // .sort-radio{
  //   padding-left: 30px;
  //   padding-bottom: 15px;
  // }
  // .timeline-item{
  //   position: relative;
  //   .el-icon-caret-right{
  //     cursor: pointer;
  //     color: #999999;
  //     position: absolute;
  //     top: 4.5px;
  //     left: 100px;
  //   }
  //   .el-icon-caret-bottom{
  //     cursor: pointer;
  //     color: #999999;
  //     position: absolute;
  //     top: 4.5px;
  //     left: 100px;
  //   }
  //   .card{
  //     margin-bottom: 8px;
  //     .log-detail{
  //       cursor: pointer;
  //       float: right;
  //       padding-right: 20px;
  //       color: #ffb600;
  //     }
  //   }
  // }
}
</style>