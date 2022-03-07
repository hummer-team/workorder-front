/*
*  @ 全局通用按钮区域组件
*  @
*/
<template>
  <div v-loading="loading">
    <default-table style="padding: 0;"
      :show-pagination="false"
      :table-data="tableData"
      :table-items="tableItems"
    ></default-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      tableItems: [
        {label: '规格', field: 'salesAttribute', width: 170},
        {label: '价格', field: 'price'}
      ]
    }
  },
  components: {},
  props: {
    data: { type: Object, default: () => { return {} } },
    rowData: { type: Object, default: () => { return {} } }
  },
  computed : {},
  methods: {
    onShow: function () {
      const { productCode, catalogVersion, publishChannel } = this.rowData
      this.getVariantProductList({ productCode, catalogVersion, publishChannel })
    },
    // 获取变量商品列表
    getVariantProductList: async function ({ productCode, catalogVersion, publishChannel }) {
      this.loading = true
      const params = {
        baseProductCode: productCode,
        catalogVersion: catalogVersion,
        channelCode: publishChannel
      }
      await this.$api.query(this.$api.product.productVariantChannel, {params}).then(({res}) => {
        if (this.checkApiSuccess(res)) {
          this.tableData = this.setDataList(res.data)
        }
      }, this.apiHandleError)
      this.loading = false
    },
    // 配置接口返回的列表数据
    setDataList: function (list) {
      list.forEach(row => {
        const attributeName = row.salesAttributes[0].attributeName
        const salesItemValue = row.variantFirstCustValue || row.salesAttributeItems[0].salesItemValue
        // const isDefaultVariant = row.isDefaultVariant ? '（默认选中）':''
        row.salesAttribute = attributeName + ':' + salesItemValue
        row.price = row.channelPrice ? '￥' + row.channelPrice : ''
      })
      return list
    }
  },
  created: function () {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
</style>
