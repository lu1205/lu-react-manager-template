import { userList, menuList, roleList, loginUser } from "./data";
import svgCaptcha from "svg-captcha";
svgCaptcha.options.width = 80;
svgCaptcha.options.height = 36;
svgCaptcha.options.fontSize = 44;
import { v4 as uuidv4 } from "uuid";

// 用户登录验证码存储对象
const captchaMap = new Map();
// 验证码失效时间间隔（1分钟）
const captchaIntervalTime = 60 * 1000;

clearInterval(captchaInterval);

const captchaInterval = setInterval(() => {
  const now = Date.now();

  captchaMap.forEach((value, key) => {
    if (now - value.timestamp > captchaIntervalTime) {
      console.log("删除", key, captchaMap);
      captchaMap.delete(key);
    }
  });
}, captchaIntervalTime);

const verifyCaptcha = (uuid, captcha) => {
  const captchaInfo = captchaMap.get(uuid);
  // 验证码失效（不存在或1分钟）
  if (
    !captchaInfo ||
    Date.now() - captchaInfo.timestamp > captchaIntervalTime
  ) {
    return {
      flag: false,
      msg: "验证码已失效，请重新获取验证码",
    };
  }

  if (!captcha) {
    return {
      flag: false,
      msg: "请输入验证码",
    };
  }

  if (captchaInfo.text === captcha) {
    return {
      flag: true,
      msg: "验证码正确",
    };
  }
  return {
    flag: false,
    msg: "验证码错误",
  };
};

const mocks = [
  // 生成验证码
  {
    url: "/api/getCaptcha",
    method: "get",
    response: () => {
      const uuid = uuidv4();
      const captchaData = svgCaptcha.create();
      captchaMap.set(uuid, {
        timestamp: Date.now(),
        text: captchaData.text,
      });

      return {
        code: 200,
        data: {
          uuid,
          img: captchaData.data,
        },
        message: "success",
      };
    },
  },

  // 登录
  {
    url: "/api/login",
    method: "post",
    response: ({ body }) => {
      const { username, password, uuid, captcha } = body;
      console.log(captchaMap, uuid, captcha);

      const verifyInfo = verifyCaptcha(uuid, captcha);

      if (!verifyInfo.flag) {
        return {
          code: 500,
          data: {},
          message: verifyInfo.msg,
        };
      }
      let userInfo = userList.find(
        (v) => v.username === username && v.password === password
      );
      if (userInfo) {
        loginUser.id = userInfo.id;
        loginUser.username = userInfo.username;
        loginUser.nickname = userInfo.nickname;
        loginUser.isAdmin = userInfo.isAdmin;
        loginUser.roles = userInfo.roles;
        captchaMap.delete(uuid);
        return {
          code: 200,
          data: {
            token: `token jkasdjakjd`,
            userInfo: {
              username: userInfo.username,
              nickname: userInfo.nickname,
            },
          },
          message: "success",
        };
      } else {
        return {
          code: 500,
          data: {},
          message: "账号密码错误",
        };
      }
    },
  },

  // 退出
  {
    url: "/api/logout",
    method: "get",
    response: () => {
      loginUser.id = "";
      loginUser.username = "";
      loginUser.nickname = "";
      loginUser.isAdmin = false;
      loginUser.roles = [];
      return {
        code: 200,
        data: {},
        message: "退出成功",
      };
    },
  },

  // 获取权限
  {
    url: "/api/getPermissionList",
    method: "get",
    response: () => {
      const id = loginUser?.id || "";
      if (!id)
        return {
          code: 403,
          data: null,
          message: "请重新登录",
        };
      // 路由权限
      let routerList = [];
      // 按钮权限
      let persList = [];
      const userInfo = userList.find((v) => v.id === Number(id));

      if (userInfo?.isAdmin) {
        // 超级管理员
        routerList = menuList;
        persList = ["*"];
        // persList = routerList.reduce((acc, cur) => {
        //   if (cur.type === "B") {
        //     acc.push(cur.menuCode);
        //   }
        //   return acc;
        // }, []);
      } else {
        const roles = userInfo.roles;
        const permissionList = [
          ...new Set(
            roles
              .map((v) => roleList.find((_) => v === _.id))
              .reduce((acc, cur) => (acc = acc.concat(cur.permissionList)), [])
          ),
        ];

        // 构建ID映射表
        const idMap = menuList.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        // 递归查找父节点
        const findParents = (id) => {
          const parents = [];
          let currentId = id;

          while (currentId !== null) {
            const currentNode = idMap[currentId];
            if (!currentNode) break; // 如果找不到当前ID对应的数据，跳出循环
            parents.push(currentNode);
            currentId = currentNode.parentId; // 更新为父节点ID
          }

          return parents;
        };

        // 收集查询结果
        routerList = permissionList.flatMap((id) => findParents(id));

        // routerList = menuList.filter((v) => permissionList.includes(v.id));

        persList = routerList.reduce((acc, cur) => {
          if (cur.type === "B") {
            acc.push(cur.menuCode);
          }
          return acc;
        }, []);
        // persList = [
        //   ...new Set(
        //     roleList
        //       .filter((v) => roles.includes(v.id))
        //       .reduce((acc, cur) => {
        //         acc = acc.concat(cur.permissionList);
        //       }, [])
        //   ),
        // ];
      }

      return {
        code: 200,
        data: {
          routerList,
          persList,
        },
        message: "success",
      };
    },
  },

  // 用户列表
  {
    url: "/api/user/getUserList",
    method: "post",
    response: ({ query, body }) => {
      const { pageNum, pageSize } = query;
      const { username } = body;
      let data = userList.filter((v) => !v.isAdmin);
      if (username) {
        data = userList.filter((v) => v.username.includes(username));
      }
      let list = data
        .slice((pageNum - 1) * pageSize, pageNum * pageSize)
        ?.map((v) => {
          return {
            ...v,
            roleName: v.roles
              ?.map((_) => {
                return roleList.find((f) => f.id === _)?.roleName;
              })
              .join(","),
          };
        });
      const total = data.length;
      return {
        code: 200,
        data: {
          list,
          total,
        },
        message: "success",
      };
    },
  },

  // 删除用户
  {
    url: "/api/user/deleteUser",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      ids.forEach((id) => {
        const fid = userList.findIndex((v) => v.id === id);
        userList.splice(fid, 1);
      });
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 用户信息
  {
    url: "/api/user/getUserInfo",
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      if (!id) return { code: 500, data: {}, message: "参数错误" };

      const user = userList?.find((v) => v.id === Number(id));

      if (!user) return { code: 500, data: {}, message: "用户不存在" };
      return {
        code: 200,
        data: user,
        message: "success",
      };
    },
  },

  // 修改用户
  {
    url: "/api/user/updateUser",
    method: "post",
    response: ({ body }) => {
      const { id, username, password, roles } = body;
      const index = userList.findIndex((v) => v.id === id);
      if (index === -1) return { code: 500, data: {}, message: "用户不存在" };

      userList[index].username = username;
      userList[index].password = password;
      userList[index].roles = roles;
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 添加用户
  {
    url: "/api/user/addUser",
    method: "post",
    response: ({ body }) => {
      const { username, password, roles } = body;
      userList.push({ id: Date.now(), username, password, roles });
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 菜单列表
  {
    url: "/api/menu/getMenuList",
    method: "get",
    response: () => {
      return {
        code: 200,
        data: menuList,
        message: "success",
      };
    },
  },

  // 新增菜单
  {
    url: "/api/menu/addMenu",
    method: "post",
    response: ({ body }) => {
      const {
        parentId,
        type,
        path,
        component,
        menuName,
        menuCode,
        icon,
        isLink,
        linkUrl,
      } = body;
      menuList.push({
        id: Date.now(),
        parentId,
        type,
        path,
        component,
        menuName,
        menuCode,
        icon,
        isLink,
        linkUrl,
      });
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 菜单信息
  {
    url: "/api/menu/getMenuInfo",
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      if (!id) return { code: 500, data: {}, message: "参数错误" };

      const menu = menuList?.find((v) => v.id === Number(id));

      if (!menu) return { code: 500, data: {}, message: "不存在" };
      return {
        code: 200,
        data: menu,
        message: "success",
      };
    },
  },

  // 修改菜单
  {
    url: "/api/menu/updateMenu",
    method: "post",
    response: ({ body }) => {
      const {
        id,
        parentId,
        type,
        path,
        component,
        menuName,
        menuCode,
        icon,
        isLink,
        linkUrl,
      } = body;
      const index = menuList.findIndex((v) => v.id === id);
      if (index === -1) return { code: 500, data: {}, message: "不存在" };

      menuList[index] = {
        id,
        parentId,
        type,
        path,
        component,
        menuName,
        menuCode,
        icon,
        isLink,
        linkUrl,
      };
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 删除菜单
  {
    url: "/api/menu/deleteMenu",
    method: "post",
    response: ({ body }) => {
      const id = Number(body.id);
      const childMenu = menuList.find((v) => v.parentId === id);
      if (childMenu) {
        return {
          code: 500,
          data: {},
          message: "存在下级子菜单，请先删除下级菜单",
        };
      }
      const index = menuList.findIndex((v) => v.id === id);
      const delArr = menuList.splice(index, 1);
      if (delArr.length) {
        return {
          code: 200,
          data: {},
          message: "success",
        };
      } else {
        return {
          code: 500,
          data: {},
          message: "删除失败，菜单不存在",
        };
      }
    },
  },

  // 角色列表
  {
    url: "/api/role/getRoleList",
    method: "post",
    response: ({ query, body }) => {
      const { pageNum, pageSize } = query;
      const { roleName } = body;
      let data = roleList;
      if (roleName) {
        data = roleList.filter((v) => v.roleName.includes(roleName));
      }
      let list = data.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      // list?.forEach((v) => {
      //   v["permissionNames"] = v.permissionList
      //     ?.map((item) => {
      //       let f_menu = menuList.find(
      //         (menu) => menu.id === item && menu.parentId
      //       );
      //       return f_menu?.menuName;
      //     })
      //     ?.filter(Boolean)
      //     ?.join(",");
      // });
      const total = data.length;
      return {
        code: 200,
        data: {
          list,
          total,
        },
        message: "success",
      };
    },
  },

  // 所有角色列表
  {
    url: "/api/role/getAllRoleList",
    method: "post",
    response: ({ body }) => {
      const { roleName } = body;
      let data = roleList;
      if (roleName) {
        data = roleList.filter((v) => v.roleName.includes(roleName));
      }
      let list = data;
      return {
        code: 200,
        data: list,
        message: "success",
      };
    },
  },

  // 新增角色
  {
    url: "/api/role/addRole",
    method: "post",
    response: ({ body }) => {
      const { roleName, remark, permissionList } = body;
      roleList.push({
        id: roleList.length + 1,
        roleName,
        remark,
        permissionList,
      });
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 角色信息
  {
    url: "/api/role/getRoleInfo",
    method: "get",
    response: ({ query }) => {
      const { id } = query;
      if (!id) return { code: 500, data: {}, message: "参数错误" };

      const role = roleList?.find((v) => v.id === Number(id));

      if (!role) return { code: 500, data: {}, message: "用户不存在" };
      return {
        code: 200,
        data: role,
        message: "success",
      };
    },
  },

  // 修改角色
  {
    url: "/api/role/updateRole",
    method: "post",
    response: ({ body }) => {
      const { id, roleName, remark, permissionList } = body;
      const index = roleList.findIndex((v) => v.id === id);
      if (index === -1) return { code: 500, data: {}, message: "用户不存在" };

      roleList[index].roleName = roleName;
      roleList[index].remark = remark;
      roleList[index].permissionList = permissionList;
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },

  // 删除角色
  {
    url: "/api/role/deleteRole",
    method: "post",
    response: ({ body }) => {
      const { ids } = body;
      ids.forEach((id) => {
        const fid = roleList.findIndex((v) => v.id === id);
        roleList.splice(fid, 1);
      });
      return {
        code: 200,
        data: {},
        message: "success",
      };
    },
  },
];

export default mocks;
