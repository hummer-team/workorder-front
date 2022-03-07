/**
 * 中台菜单配置文件
 *
 */

let menuTree = []

// 所有页面数据，包括不在菜单里面的
// code 对应页面vue文件的【name】 及 router配置对象里面的 【name】必须一致
// 也可以是文件名 三者需保持一致
let menuData = [
	{name: '首页', code: 'mainIndex', path: '/main/index', isDefault: true},
	{name: '创建工单', code: 'workorderDetail', path: '/workorder/workorderDetail'},
	{name: '工单列表', code: 'workorderList', path: '/workorder/workorderList'},
	{name: '工单详情', code: 'workorderDetail', path: '/workorder/workorderDetail'},
	{name: '待审批工单列表', code: 'pendingApprovalWorkorderList', path: '/workorder/pendingApprovalWorkorderList'},
	{name: '待执行工单列表', code: 'pendingExecuteWorkorderList', path: '/workorder/pendingExecuteWorkorderList'},
	{name: '用户列表', code: 'userList', path: '/user/userList'},
	{name: '模板列表', code: 'templateList', path: '/template/templateList'}
]

function getMenu (code) {
	for (let i in list) {
		let menu = list[i]
		if (menu.code === code) {
			return menu
		} else if (menu.child) {
			let pmenu = getMenu(code)
			if (pmenu) {
				return pmenu
			}
		}
	}
	return null
}

function getMenuParent ({list, parent, code, level}) {
	list = list || menuData
	parent = parent || null
	for (let i in list) {
		let menu = list[i]
		if (menu.code === code) {
			return parent
		} else if (menu.child) {
			let pmenu = getMenuParent({list: menu.child, parent: menu, code: code, level: level})
			if (pmenu) {
				return pmenu
			}
		}
	}
	return null
}

export {
  menuTree,
  menuData,
  getMenu,
  getMenuParent
}
