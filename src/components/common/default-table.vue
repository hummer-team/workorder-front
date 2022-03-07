/*
*  @ 全局通用table组件
*  @
*/
<template>
  <div class="default-table" v-if="!refreshTag" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.4)">
    <el-table :id="'table_'+uuid" ref="default-table" :data="tableDataShow" :class="tabelClassList" :max-height="maxHeight" :empty-text="emptyText" :border="true" :stripe="true" @selection-change="onSelectionChange" @sort-change="onSortChange" :span-method="spanMergeMethod" :row-key="rowKey" :row-class-name="getRowClassName" :tree-props="{children: children, hasChildren: hasChildren}" :load="load" :lazy="lazy">
      <!-- Sortable排序句柄选择列 -->
      <el-table-column v-if="tableDraggable" label="" width="22" align="center">
        <i class="el-icon-s-unfold"></i>
      </el-table-column>
      <!-- 树形结构展开图标列 -->
      <el-table-column width="35" v-if="children" fixed="left"></el-table-column>
      <!-- checkbox选择列 -->
      <el-table-column v-if="tableSelectAbled" label="选择" width="48" align="center" type="selection" :selectable="lineSelectAbled"></el-table-column>
      <!-- 固定序号列 -->
      <el-table-column label="#" width="40" align="center" type='index' :index='1' v-if="showSerialNumber">
      </el-table-column>
      <!-- 自定义checkbox选择列 -->
      <el-table-column v-if="showCustomCheckbox" label="选择" width="48" align="center">
        <template slot="header" slot-scope="scope">
          <default-checkbox :data="customCheckbox.checkAllItem" v-model="customCheckbox.checkAllValue"></default-checkbox>
        </template>
        <template slot-scope="scope">
          <default-checkbox v-model="scope.row[customCheckbox.checkItem.field]" :data="customCheckbox.checkItem" :row-data="scope.row"></default-checkbox>
        </template>
      </el-table-column>
      <!-- 固定操作按钮列 -->
      <el-table-column label="操作" width="152" align="center" v-if="quickButtonList && quickButtonList.length > 0">
        <template slot-scope="scope">
          <el-button v-for="(button, index) in quickButtonList" v-show="isFunction(button.isShow) ? button.isShow(scope.row) : button.isShow || true" :disabled="isFunction(button.disabled) ? button.disabled(scope.row) : button.disabled || false " :type="button.type" :key="index" @click="button.function(scope.row)" style="float:none">
            {{button.label}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="getButtonColumnWidth()" align="center" v-if="tableButtonList.length > 0 && style.buttonPlace === 'left' && showButtonColumn">
        <template slot-scope="scope">
          <default-button v-for="(button, index) in tableButtonList" :key="index" :data="button" :row-data="scope.row">></default-button>
        </template>
      </el-table-column>
      <!-- 通过 tableItems 加载的业务字段列 -->
      <el-table-column v-for="(item, key) in tableItems" :key="item.field+'-'+key" :prop="item.field" :label="item.label" :width="item.width" :min-width="item.minWidth" :sortable="item.sortable" :align="item.align" :show-overflow-tooltip="item.showOverflowTooltip" v-if="checkColumnShow(item)">
        <template slot="header" slot-scope="scope">
          <span v-html="item.label"></span>
        </template>
        <template slot-scope="scope">
          <component v-bind:is="getItemComponentName(item, scope.row)" v-model="scope.row[item.field]" :ref="'component_' + item.field" :data="item" :row-data="scope.row" :validate="item.validate"></component>
        </template>
      </el-table-column>
      <!-- 固定操作按钮列 -->
      <el-table-column label="操作" :width="getButtonColumnWidth()" align="center" v-if="tableButtonList.length > 0 && style.buttonPlace === 'right' && showButtonColumn">
        <template slot-scope="scope">
          <default-button v-for="(button, index) in tableButtonList" :key="index" :data="button" :row-data="scope.row"></default-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码组件 -->
    <el-pagination v-if="showPagination" @size-change="pageSizeChange" @current-change="pageIndexChange" :current-page="tablePage.pageNumber" :page-sizes="tablePage.sizes" :page-size="tablePage.pageSize" :layout="tablePage.layout" :total="tablePage.total">
    </el-pagination>
  </div>
</template>

<script>
import {ApiConf} from '@/config'
import {getUUID} from '@/utils/helper'

import Sortable from 'sortablejs'

export default {
  name: 'default-table',
  data () {
    return {
      uuid: '',
      refreshTag: false,
      customCheckbox: {
        checkAllValue: false,
        checkAllItem: {
          disabled: true
        },
        checkItem: {
          field: '_isChecked',
          disabled: (row) => {
            return this.lineSelectAbled ? !this.lineSelectAbled(row) : false
          },
          onChange: ({value, row}) => {
            this.$emit('custom-checkbox-select', row)
          }
        }
      },
      // 当前选中列表行
      selectionList: [],
      // 表头行高度
      headHeight: 45,
      // 表内容行高度
      lineHeight: 45,
      // table样式配置对象
      style: {},
      // 默认页码数据
      pageDefault: {
        layout: 'total, prev, pager, next, sizes, jumper',
        sizes: [10, 20, 50],
        pageSize: 10,
        pageNumber: 1,
        total: 0
      },
      // 需要合并的字段数据
      autoMergeItemList: [],
      // 单独整理的字段整合数据列表 仅存储需要合并的字段
      tableDataForMerge: []
    }
  },
  props: {
    // 加载中状态
    loading: {type: Boolean, default: false},
    // table类型 default
    tableType: {type: String, default: 'default'},
    // table数据对象
    tableData: {type: Array, default: () => { return [] }},
    // table字段配置列表
    tableItems: {type: Array, default: () => { return [] }},
    // table样式配置对象
    tableStyle: {type: Object, default: () => { return {} }},
    // table按钮配置列表
    tableButtonList: {type: Array, default: () => { return [] }},
    // table页码数据对象
    tablePage: {type: Object, default: () => { return {} }},
    // 是否显示checkbox列
    tableSelectAbled: {type: Boolean, default: false},
    // 决定这一行的 CheckBox 是否可以勾选
    lineSelectAbled: {type: Function, default: null},
    // 决定这一行的 className
    lineClassName: {type: Function, default: null},
    // 显示自定义checkbox列
    showCustomCheckbox: {type: Boolean, default: false},
    // 是否显示操作按钮列
    showButtonColumn: {type: Boolean, default: true},
    // 显示序列号固定列
    showSerialNumber: {type: Boolean, default: false},
    // 显示页码条
    showPagination: {type: Boolean, default: true},
    // 使用前端分页
    frontendPagination: {type: Boolean, default: false},
    // table空数据时显示的文本内容
    emptyText: {type: String, default: '暂无数据'},
    // item空数据时显示的文本内容
    itemEmptyText: {type: String, default: '-'},
    // 列表拖拽排序
    tableDraggable: {type: Boolean, default: false},
    // 拖动排序指定row-key, tableData中的某一字段
    rowKey: {type: String, default: ''},
    // 行列合并自定义方法
    doSpanMerge: {type: Function, default: null},
    // 单个按钮
    quickButtonList: {type: Array, default: () => { return [] }},
    // 子节点字段名
    children: {type: String, default: ''},
    // 是否包含子节点
    hasChildren: {type: String, default: ''},
    // 拖动结束的自定义事件
    onSortEnd: {type: Function, default: null},
    // 懒加载子行方法
    load: {type: Function, default: null},
    // 是否懒加载
    lazy: {type: Boolean, default: false}
  },
  computed: {
    tableDataShow: function () {
      if (this.frontendPagination) {
        const { pageSize, pageNumber } = this.tablePage
        const start = (pageNumber - 1) * pageSize
        const end = start + pageSize
        return this.tableData.slice(start, end)
      }
      return this.tableData
    },
    tabelClassList: function () {
      let list = [this.style.tableSize]
      // 控制是否显示td之间的竖线
      if (this.style.showVerticalBorder === true) {
        list.push('vertical-border')
      }
      return list
    },
    styleHeight: function () {
      return this.style.fixedHeight ? this.maxHeight + 130 : null
    },
    maxHeight: function () {
      const scrollBarHeight = 12
      return this.style.maxLine ? (this.style.maxLine * this.lineHeight + this.headHeight + scrollBarHeight) : null
    }
  },
  watch: {
    tableData: function (list) {
      const checkField = this.customCheckbox.checkItem.field
      if (this.showCustomCheckbox) {
        list.map(line => {
          if (!this.isSet(line[checkField])) {
            this.$set(line, checkField, false)
          }
        })
      }
      if (this.frontendPagination) {
        this.tablePage.total = list.length
        if (this.tablePage.total === 0) {

        } else if (this.tablePage.total <= (this.tablePage.pageNumber - 1) * this.tablePage.pageSize) {
          this.tablePage.pageNumber = parseInt((this.tablePage.total - 1) / this.tablePage.pageSize) + 1
        }
      }
      this.setTableDataForMerge()
    }
  },
  methods: {
    dataInit: function () {
      this.uuid = getUUID()
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(`#table_${this.uuid} .el-table__body-wrapper tbody`)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const moveItem = _this.tableData[oldIndex]
          _this.tableData.splice(oldIndex, 1)
          _this.tableData.splice(newIndex, 0, moveItem)
          if (_this.isFunction(_this.onSortEnd)) {
            _this.onSortEnd(newIndex, oldIndex)
          }
        },
        handle: '.el-icon-s-unfold'
      })
    },
    // 对table字段进行默认赋值、校验等初始化的操作
    setTableItemsInit: function () {
      this.autoMergeItemList = []
      this.tableItems.forEach((item, index) => {
        // 设置默认 type
        if (!item.type) {
          item.type = 'text'
        }
        // 设置默认高度【图片】
        if (item.type === 'image' || item.type === 'image-list') {
          if (!item.imageHeight) {
            item.imageHeight = 36
          }
          if (!item.imageWidth) {
            item.imageWidth = 36
          }
        }
        if (!item.emptyText) {
          item.emptyText = this.itemEmptyText
        }
        // 配置字段对应组件
        if (!item.componentName) {
          this.setItemComponentName(item)
        }

        // 配置autoMerge字段处理
        if (item.autoMerge === true) {
          const mergeItem = {field: item.field, lastMergeField: ''}
          if (index > 0) {
            const lastItem = this.tableItems[index - 1]
            if (lastItem.autoMerge === true) {
              mergeItem.lastMergeField = lastItem.field
            }
          }
          this.autoMergeItemList.push(mergeItem)
        }
      })
    },
    // 对table数据对象进行初始化操作
    setTableDataInit: function () {
      // 页码数据初始化
      if (this.showPagination && this.tablePage) {
        const { layout, sizes, pageSize, pageNumber, total } = this.pageDefault
        if (!this.isSet(this.tablePage.layout)) this.tablePage.layout = layout
        if (!this.isSet(this.tablePage.sizes)) this.tablePage.sizes = sizes
        if (!this.isSet(this.tablePage.pageSize)) {
          this.$set(this.tablePage, 'pageSize', pageSize)
        }
        if (!this.isSet(this.tablePage.pageNumber)) {
          this.$set(this.tablePage, 'pageNumber', pageNumber)
        }
        if (!this.isSet(this.tablePage.total)) {
          if (this.frontendPagination) {
            this.$set(this.tablePage, 'total', this.tableData.length)
          } else {
            this.$set(this.tablePage, 'total', total)
          }
        }
      }
    },
    // 初始化table默认样式
    setTableStyleInit: function () {
      let { maxLine, tableSize, buttonPlace, buttonWrapWidth, fixedHeight, showVerticalBorder } = this.tableStyle
      // 最大显示行数
      maxLine = maxLine ? parseInt(maxLine) : 0
      tableSize = tableSize || 'size-default'
      // 操作列位置
      buttonPlace = buttonPlace || 'right'
      // 操作列指定宽度
      buttonWrapWidth = parseInt(buttonWrapWidth) || 0
      fixedHeight = Boolean(fixedHeight)
      // 是否显示td的竖线
      showVerticalBorder = Boolean(showVerticalBorder)
      if (tableSize === 'size-small') {
        this.headHeight = 40
        this.lineHeight = 40
      }

      this.style = { maxLine, tableSize, buttonPlace, buttonWrapWidth, fixedHeight, showVerticalBorder }
    },
    // 配置tableDataForMerge数组信息
    setTableDataForMerge: function () {
      this.tableDataForMerge = []
      if (this.autoMergeItemList.length > 0 && this.tableData.length > 0) {
        const temFieldDataList = {}
        this.tableData.forEach(line => {
          const lineObj = []
          this.autoMergeItemList.forEach(item => {
            // 需合并字段，上一个且需合并的字段
            const {field, lastMergeField} = item
            // 字段值
            const value = line[field]
            const itemObj = {value, field, rowspan: 1, colspan: 1 }
            // 当有需要累加的字段
            if (temFieldDataList[field]) {
              // 如果跟当前统计字段的值一致
              if (temFieldDataList[field].value === value) {
                // 判断是否需要考虑前一个字段的合并情况 
                if (lastMergeField) {
                  // 获取同行的前一个字段
                  const lastItemObj = lineObj.find(item => item.field === lastMergeField)
                  // 如果前一个字段不属于收起的内容
                  if (lastItemObj.rowspan !== 0) {
                    temFieldDataList[field] = itemObj
                  } else {
                    // 处理合并逻辑
                    temFieldDataList[field].rowspan += 1
                    itemObj.rowspan = 0
                  }
                } else {
                  // 处理合并逻辑
                  temFieldDataList[field].rowspan += 1
                  itemObj.rowspan = 0
                }
              } else {
                temFieldDataList[field] = itemObj
              }
            } else {
              temFieldDataList[field] = itemObj
            }
            lineObj.push(itemObj)
          })
          this.tableDataForMerge.push(lineObj)
        })
      }
    },
    // 合并行或列的计算方法
    // 执行顺序 行1列1 -> 行1列2
    spanMergeMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (this.isFunction(this.doSpanMerge)) {
        return this.doSpanMerge({ row, column, rowIndex, columnIndex })
      } else {
        if (this.autoMergeItemList.length && this.tableDataForMerge.length) {
          const field = column.property
          if (this.autoMergeItemList.find(item => item.field === field)) {
            const lineObj = this.tableDataForMerge[rowIndex]
            const {rowspan} = lineObj.find(item => item.field === field)
            return {rowspan, colspan: 1}
          }
        }
        return {rowspan: 1, colspan: 1}
      }
    },
    // 动态配置数据行的classname 支持返回【字符串】或【数组】
    // 背景色： bg-red, bg-org, bg-green
    // 字体色： font-red, font-org, font-green
    getRowClassName: function ({row, rowIndex}) {
      if (this.lineClassName) {
        return this.lineClassName({row, rowIndex})
      }
      return ''
    },
    // 获取组件 ComponentName
    getItemComponentName: function (item, row) {
      this.setItemComponentName(item, row)
      return item.componentName
    },
    // 获取整列item的组件对象
    getItemComponentCloumn: function (field) {
      if (!field) return null
      if (this.$refs['component_' + field]) {
        return this.$refs['component_' + field]
      }
      return null
    },
    // 获取item的组件对象列表
    getItemComponentList: function () {
      return this.tableItems.map(item => {
        return item.field ? this.getItemComponentCloumn(item.field) : null
      }).filter(com => com !== null).reduce((a, b) => a.concat(b))
    },
    // 获取操作列宽度
    getButtonColumnWidth: function () {
      if (this.style.buttonWrapWidth) {
        return this.style.buttonWrapWidth
      }
      if (this.tableButtonList.length) {
        return 20 + this.tableButtonList.length * 20 + this.tableButtonList.map(v => v.label.length).reduce((prev, curr) => { return prev + curr }) * 12
      }
      return 0
    },
    // 获取选中的数据
    getSelection: function () {
      return this.selectionList
    },
    // 当排序发生变化时会触发该事件
    onSortChange: function ({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    // 当选择项发生变化时会触发该事件
    onSelectionChange: function (val) {
      this.selectionList = val
      this.$emit('line-select-change', this.selectionList)
    },
    // 设置多行数据选中状态
    setSelectionList: function (list, key = '', selected = true) {
      if (!key) return
      list.forEach(line => {
        const tableLine = this.tableData.find(obj => obj[key] === line[key])
        if (tableLine) {
          this.$refs['default-table'].toggleRowSelection(tableLine, selected)
        }
      })
    },
    // 每页数量变化
    pageSizeChange: function (size) {
      this.tablePage.pageNumber = 1
      this.tablePage.pageSize = size
      this.$emit('get-data-list')
    },
    // 页码变化
    pageIndexChange: function (index) {
      this.tablePage.pageNumber = index
      if (this.frontendPagination) {
        this.refreshTable()
      }
      this.$emit('get-data-list')
    },
    // 判断数据列是否显示
    checkColumnShow: function (item) {
      if (this.isSet(item.isShow)) {
        if (this.isFunction(item.isShow)) {
          return item.isShow()
        } else {
          return item.isShow
        }
      }
      return true
    },
    // 发起表单校验
    validateTable: async function () {
      let isValidate = true
      const itemComponentList = this.getItemComponentList()

      for (let i in itemComponentList) {
        const { isSuccess, errorMessage } = await itemComponentList[i].doValidate()
        if (isSuccess === false) {
          isValidate = false
        }
      }

      return isValidate
    },
    // 清除表单字段校验状态
    resetValidate: function () {
      const itemComponentList = this.getItemComponentList()

      for (let i in itemComponentList) {
        itemComponentList[i].clearValidateData()
      }
    },
    // 刷新列表
    refreshTable: function () {
      this.refreshTag = true
      this.$nextTick(() => {
        this.refreshTag = false
      })
    }
  },
  created () {
    this.dataInit()
    this.setTableItemsInit()
    this.setTableDataInit()
    this.setTableStyleInit()
    this.setTableDataForMerge()
  },
  mounted () {
    if (this.tableDraggable) {
      this.rowDrop()
    }
  }
}
</script>
<style lang="scss" scoped>
$bg-red: #fff3f0;
$bg-org: #fdf5e6;
$bg-green: #f0f9eb;
.default-table{
  .el-icon-s-unfold{
    cursor: move;
    font-size: 15px;
  }
  >>> .el-table__row{
    &.bg-red td{
      background-color: $bg-red;
    }
    &.bg-org td{
      background-color: $bg-org;
    }
    &.bg-green td{
      background-color: $bg-green;
    }
    &.font-red td{
      color: $color-red;
    }
    &.font-org td{
      color: $color-org;
    }
    &.font-green td{
      color: $color-green;
    }
  }
}
</style>
