/**
* 接口配置子模块
**/

const config = {
  templateList: {
    url: '/v1/template/list',
    method: 'get',
    type: 'udtReform'
  },
  templateNew: {
    url: '/v1/template/new',
    method: 'post',
    type: 'udtReform'
  },
  projectList: {
    url: '/v1/template/project-code/list',
    method: 'get',
    type: 'udtReform'
  }
}
export default config
