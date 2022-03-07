/**
* 接口配置子模块
**/

const config = {
  login: {
    url: '/v1/user/login',
    method: 'post',
    type: 'udtReform'
  },
  list: {
    url: '/v1/work-order/page-list',
    method: 'post',
    type: 'udtReform'
  },
  new: {
    url: '/v1/work-order/new',
    method: 'post',
    type: 'udtReform'
  },
  edit: {
    url: '/v1/work-order/edit',
    method: 'post',
    type: 'udtReform'
  },
  cancel: {
    url: '/v1/work-order/cancel',
    method: 'post',
    type: 'udtReform'
  },
  info: {
    url: '/v1/work-order/details',
    method: 'get',
    type: 'udtReform'
  },
  flowHandler: {
    url: '/v1/work-order/flow-handler',
    method: 'post',
    type: 'udtReform'
  }
}
export default config
