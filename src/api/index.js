import { httpRequest } from "@/utils/request";

// 获取验证码
export function getCaptcha() {
  return httpRequest.request({
    url: "/react/user/getCaptcha",
    method: "GET",
  });
}

// 登录
export const login = (data) => {
  return httpRequest.request({
    url: "/react/user/login",
    method: "POST",
    data,
  });
};

// 退出
export function logout() {
  return httpRequest.request({
    url: "/react/user/logout",
    method: "GET",
  });
}

// 获取用户权限信息
export const getPermissionList = (params) => {
  return httpRequest.request({
    url: "/react/user/getPermissionList",
    method: "GET",
    params,
  });
};

/**
 *
 * 用户管理开始
 */

// 用户列表
export const getUserList = (params, data) => {
  return httpRequest.request({
    url: "/react/user/list",
    method: "POST",
    params,
    data,
  });
};

// 添加用户
export const addUser = (data) => {
  return httpRequest.request({
    url: "/react/user/add",
    method: "POST",
    data,
  });
};

// 查询用户信息
export const getUserInfo = (params) => {
  return httpRequest.request({
    url: "/react/user/detail",
    method: "GET",
    params,
  });
};

// 更新用户信息
export const updateUser = (data) => {
  return httpRequest.request({
    url: "/react/user/edit",
    method: "POST",
    data,
  });
};

// 切换用户状态
export const changeUserStatus = (data) => {
  return httpRequest.request({
    url: "/react/user/status",
    method: "POST",
    data,
  });
};

// 删除用户
export const deleteUser = (data) => {
  return httpRequest.request({
    url: "/react/user/delete",
    method: "POST",
    data,
  });
};

// 批量删除用户
export const batchDeleteUser = (data) => {
  return httpRequest.request({
    url: "/react/user/batchDelete",
    method: "POST",
    data,
  });
};

// 获取用户角色
export const getUserRoleDetail = (params) => {
  return httpRequest.request({
    url: '/react/user/getRoles',
    method: 'get',
    params,
  })
}

// 设置用户角色
export const editUserRole = (data) => {
  return httpRequest.request({
    url: '/react/user/editRole',
    method: 'post',
    data,
  })
}


/**
 *
 * 用户管理结束
 */

/**
 *
 * 菜单管理开始
 */

// 菜单列表
export const getMenuList = () => {
  return httpRequest.request({
    url: "/react/menu/list",
    method: "GET",
  });
};

// 新增菜单
export const addMenu = (data) => {
  return httpRequest.request({
    url: "/react/menu/add",
    method: "POST",
    data,
  });
};

// 菜单信息
export const getMenuInfo = (params) => {
  return httpRequest.request({
    url: "/react/menu/detail",
    method: "GET",
    params,
  });
};

// 修改菜单
export const updateMenu = (data) => {
  return httpRequest.request({
    url: "/react/menu/edit",
    method: "POST",
    data,
  });
};

// 删除菜单
export const deleteMenu = (data) => {
  return httpRequest.request({
    url: "/react/menu/delete",
    method: "POST",
    data,
  });
};

/**
 *
 * 菜单管理结束
 */

/**
 *
 * 角色管理开始
 */

// 所有角色列表
export const getAllRoleList = () => {
  return httpRequest.request({
    url: "/react/role/all",
    method: "GET",
  });
};

// 角色列表
export const getRoleList = (params, data) => {
  return httpRequest.request({
    url: "/react/role/list",
    method: "POST",
    params,
    data,
  });
};

// 新增角色
export const addRole = (data) => {
  return httpRequest.request({
    url: "/react/role/add",
    method: "POST",
    data,
  });
};

// 角色信息
export const getRoleInfo = (params) => {
  return httpRequest.request({
    url: "/react/role/detail",
    method: "GET",
    params,
  });
};

// 修改角色
export const updateRole = (data) => {
  return httpRequest.request({
    url: "/react/role/edit",
    method: "POST",
    data,
  });
};

// 启用/停用
export const changeRoleStatus = (data) => {
  return httpRequest.request({
    url: "/react/role/status",
    method: "POST",
    data,
  });
};

// 删除角色
export const deleteRole = (data) => {
  return httpRequest.request({
    url: "/react/role/delete",
    method: "POST",
    data,
  });
};

// 批量删除角色
export const batchDdeleteRole = (data) => {
  return httpRequest.request({
    url: "/react/role/batchDelete",
    method: "POST",
    data,
  });
};

// 权限详情
export const getPermissionDetail = (params) => {
  return httpRequest.request({
    url: '/react/role/permissionDetail',
    method: 'get',
    params,
  })
}

// 设置权限
export const editPermissions = (data) => {
  return httpRequest.request({
    url: '/react/role/editPermissions',
    method: 'post',
    data,
  })
}

/**
 *
 * 角色管理结束
 */


/**
 *
 * 日志管理开始
 */

// 日志列表
export const getLogList = (params, data) => {
  return httpRequest.request({
    url: "/react/logs/list",
    method: "POST",
    params,
    data,
  });
};

// 日志信息
export const getLogInfo = (params) => {
  return httpRequest.request({
    url: "/react/logs/detail",
    method: "GET",
    params,
  });
};
/**
 *
 * 日志管理结束
 */