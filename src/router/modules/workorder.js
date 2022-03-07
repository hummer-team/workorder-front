import workorderList from '@/views/workorder/workorderList'
import workorderDetail from '@/views/workorder/workorderDetail'
import pendingApprovalWorkorderList from '@/views/workorder/pendingApprovalWorkorderList'
import pendingExecuteWorkorderList from '@/views/workorder/pendingExecuteWorkorderList'
import userList from '@/views/user/userList'
import templateList from '@/views/template/templateList'

export const workorderRoute = [{
  path: 'workorder/workorderList',
  name: 'workorderList',
  component: workorderList
}, {
  path: 'workorder/workorderDetail',
  name: 'workorderDetail',
  component: workorderDetail
}, {
  path: 'workorder/pendingApprovalWorkorderList',
  name: 'pendingApprovalWorkorderList',
  component: pendingApprovalWorkorderList
}, {
  path: 'workorder/pendingExecuteWorkorderList',
  name: 'pendingExecuteWorkorderList',
  component: pendingExecuteWorkorderList
}, {
  path: 'user/userList',
  name: 'userList',
  component: userList
}, {
  path: 'template/templateList',
  name: 'templateList',
  component: templateList
}]
