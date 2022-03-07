import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from '@/i18n/cn'
import en from '@/i18n/en'
import storage from '@/utils/storage'

Vue.use(VueI18n)

let locale = storage.get('i18n') || 'cn'

const messages = {
  cn,
  en
}

const i18n = new VueI18n({
  // 设置地区
  locale: locale,
  // 设置地区信息
  messages
})

export default i18n
