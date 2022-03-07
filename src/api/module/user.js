/**
* 接口配置子模块
**/

const config = {
  userList: {
    url: '/v1/user/list',
    method: 'get',
    type: 'udtReform'
  },
  userNew: {
    url: '/v1/user/new',
    method: 'post',
    type: 'udtReform'
  },
  roleList: {
    url: '/v1/role/list',
    method: 'get',
    type: 'udtReform'
  }
}
export default config
