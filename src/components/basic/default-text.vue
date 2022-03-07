/*
*  @ 全局基础文本组件
*  @
*/
<template>
  <div class="basic-item-wrap default-text" v-html="getMessage()" @dblclick="onDblclick">
  </div>
</template>

<script>
import Vue from 'vue'
import basicItemMixin from './basic-item-mixin'
import { escapeHTML } from '@/utils/helper'
export default {
  name: 'default-text',
  mixins: [basicItemMixin],
  data () {
    return {
      dictionary: '',
      format: null,
      filters: [],
      options: null,
      emptyText: null
    }
  },
  props: {
  },
  computed : {
  },
  watch: {
  },
  methods: {
    dataInit: function () {
      const { dictionary, format, filter, options, emptyText } = this.data

      this.dictionary = this.isSet(dictionary) ? dictionary : ''
      this.format = this.isFunction(format) ? format : null
      this.filters = this.isSet(filter) ? (this.isArray(filter) ? filter : [filter]) : []
      this.options = this.isSet(options) ? options : null
      this.emptyText = this.isSet(emptyText) ? emptyText : null
    },
    getMessage: function () {
      let value = escapeHTML(this.value)
      if (this.format) {
        const formatVal = this.format(this.rowData)
        if (formatVal || formatVal === false || formatVal === 0) {
          return formatVal
        }
        return this.emptyText || ''
      }
      if (value || value === false || value === 0) {
        if (this.options) {
          let options = this.options
          if (this.isFunction(this.options)) {
            options = this.options()
          }
          if (options) {
            const opt = options.find(opt => opt.code === value) || {}
            return opt.name || ''
          }
          return ''
        }
        if (this.dictionary) {
          if (this.data.split) {
            let valueArr = this.value.split(this.data.split)
            return valueArr.map(value => {
              return this.getDictionaryName(this.dictionary, value)
            }).join(this.data.split)
          }
          return this.getDictionaryName(this.dictionary, this.value)
        }
        if (this.filters.length) {
          this.filters.map(filter => {
            const func = Vue.filter(filter)
            if (func) {
              value = func(value)
            }
          })
        }
      } else {
        if (this.emptyText) {
          return this.emptyText
        }
      }
      return value
    },
    // 双击事件
    onDblclick: function () {
      if (this.isFunction(this.data.onDblclick)) {
        this.data.onDblclick(this.rowData)
      }
    }
  },
  created: function (){
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
.default-text{
}
</style>
