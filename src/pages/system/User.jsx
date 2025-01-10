import { useState } from "react";
import {
  getUserList,
  deleteUser,
  getUserInfo,
  updateUser,
  addUser,
  getAllRoleList,
  getUserRoleDetail,
  editUserRole,
} from "../../api";
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Flex,
  Popconfirm,
  message,
  Modal,
  Select,
  Segmented,
} from "antd";
import PermCom from "../../components/PermCom";
import { statusOptions } from "../../enums/index";

const User = () => {
  const [username, setUsername] = useState("");
  const [list, setList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  // 获取列表数据
  const getListData = async () => {
    const res = await getUserList(
      {
        pageNum: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
      { username }
    );
    if (res.code === 200) {
      setList(res.data.list);
      setTableParams({
        ...tableParams,
        pagination: { ...tableParams.pagination, total: res.data.total },
      });
    }
  };

  const [allRoleList, setAllRoleList] = useState([]);

  // 获取所有角色数据
  const getAllRoleData = async () => {
    const res = await getAllRoleList();
    if (res.code === 200) {
      setAllRoleList(
        res.data?.map((v) => {
          return { ...v, value: v.id, label: v.fullname };
        })
      );
    }
  };
  useEffect(() => {
    getAllRoleData();
  }, []);

  useEffect(() => {
    getListData();
  }, [
    username,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  // 搜索
  const onFinish = async (values) => {
    const { username } = values;
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
    setUsername(username);
  };

  // 列表显示数据
  const columns = [
    {
      title: "序号",
      key: "index",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text, record, index) => {
        return record.status === 0 ? "启用" : "禁用";
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      width: 200,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Flex gap="small">
              <PermCom roles="system:user:role">
                <Button
                  type="primary"
                  onClick={() => handleClickEditUserRole(record.id)}
                >
                  设置角色
                </Button>
              </PermCom>

              <PermCom roles="system:user:edit">
                <Button
                  type="primary"
                  onClick={() => handleClickAddEdit(record.id)}
                >
                  修改
                </Button>
              </PermCom>

              <PermCom roles="system:user:delete">
                <Popconfirm
                  title="删除"
                  description="确定要删除吗？"
                  onConfirm={() => confirmDelete(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="primary" danger>
                    删除
                  </Button>
                </Popconfirm>
              </PermCom>
            </Flex>
          </>
        );
      },
    },
  ];

  // 设置角色 dialog 标识
  const [userRoleModal, setUserRoleModal] = useState(false);
  // 设置角色 表单实例
  const [userRoleForm] = Form.useForm();
  // 回显设置角色 dialog 数据
  const handleClickEditUserRole = async (id) => {
    const res = await getUserRoleDetail({ id });
    if (res.code === 200) {
      userRoleForm.setFieldsValue({
        // ...res.data,
        id: res.data.id,
        roles: res.data.roles
          ? res.data.roles?.split(",")?.map((v) => Number(v))
          : [],
      });
      setUserRoleModal(true);
    }
  };

  // 提交设置角色数据
  const handleUserRoleOk = async () => {
    userRoleForm.validateFields().then(async () => {
      const formData = {
        id: userRoleForm.getFieldValue("id"),
        roles: userRoleForm.getFieldValue("roles"),
      };
      const res = await editUserRole(formData);
      if (res.code === 200) {
        message.success("操作成功");
        setUserRoleModal(false);
        getListData();
      }
    });
  };

  // 关闭设置角色 dialog
  const handleUserRoleCancel = () => {
    setUserRoleModal(false);
  };

  // 批量删除
  const confirmBatchDelete = async (id) => {
    console.log(id);
    const res = await deleteUser({ ids: [id] });
    if (res.code === 200) {
      message.success("删除成功");
      refresh();
    }
  };

  // 删除
  const confirmDelete = async (id) => {
    console.log(id);
    const res = await deleteUser({ id });
    if (res.code === 200) {
      message.success("删除成功");
      refresh();
    }
  };

  // 刷新列表
  const refresh = () => {
    if (tableParams.pagination.current === 1) {
      getListData();
    } else {
      setTableParams({
        ...tableParams,
        pagination: { ...tableParams.pagination, current: 1 },
      });
    }
  };

  // 新增/修改 dialog 标识
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 新增/修改 表单实例
  const [form] = Form.useForm();

  // 显示新增/修改model
  const handleClickAddEdit = async (id) => {
    if (!id) {
      form.resetFields();
      setIsModalOpen(true);
    } else {
      const res = await getUserInfo({ id });
      if (res.code === 200) {
        form.setFieldsValue(res.data);
        setIsModalOpen(true);
      }
    }
  };

  // 新增/修改
  const handleOk = async () => {
    // console.log(form);
    form.validateFields().then(async (values) => {
      console.log(values);
      let formData = form.getFieldValue();
      console.log(formData);
      if (formData.id) {
        const res = await updateUser(formData);
        if (res.code === 200) {
          message.success("修改成功");
          setIsModalOpen(false);
          getListData();
        }
      } else {
        const res = await addUser(values);
        if (res.code === 200) {
          message.success("新增成功");
          setIsModalOpen(false);
          getListData();
        }
      }
    });
  };

  // 关闭 新增/修改 dialog
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 切换页码/页数
  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setList([]);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="search-area">
          <Form
            name="basic"
            layout="inline"
            initialValues={{ username: "" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="用户名" name="username">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="mb-[10px] flex justify-end">
          <Flex gap="small">
            <Button type="primary" onClick={() => refresh()}>
              刷新
            </Button>
            <PermCom roles="system:user:add">
              <Button type="primary" onClick={() => handleClickAddEdit()}>
                新增
              </Button>
            </PermCom>
          </Flex>
        </div>
        <div className="tableArea" style={{ flex: 1, overflow: "auto" }}>
          <Table
            columns={columns}
            dataSource={list}
            rowKey={(record) => record.id}
            pagination={{
              ...tableParams.pagination,
              showSizeChanger: true,
            }}
            onChange={handleTableChange}
            className="auto-height-table-and-pagination"
          />
        </div>
      </div>

      <Modal
        title="编辑"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          initialValues={{ status: 0 }}
          labelCol={{ span: 4 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          {isModalOpen && !form.getFieldValue("id") && (
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="请输入" />
            </Form.Item>
          )}
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Segmented options={statusOptions} />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑"
        open={userRoleModal}
        onOk={handleUserRoleOk}
        onCancel={handleUserRoleCancel}
      >
        <Form
          form={userRoleForm}
          labelCol={{ span: 4 }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="roles" label="角色">
            <Select
              mode="multiple"
              showSearch
              placeholder="请选择角色"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={allRoleList}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
