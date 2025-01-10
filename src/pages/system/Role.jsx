import { useState } from "react";
import {
  getRoleList,
  getMenuList,
  getRoleInfo,
  deleteRole,
  updateRole,
  addRole,
  getPermissionDetail,
  editPermissions,
} from "../../api";
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Pagination,
  Flex,
  Modal,
  Popconfirm,
  message,
  Tree,
  Segmented,
  Drawer,
  Space,
} from "antd";
import { toTree } from "../../utils/common";
import { statusOptions } from "../../enums/index";
import PermCom from "../../components/PermCom";
import { useRef } from "react";

const Role = () => {
  const [fullname, setFullname] = useState("");
  const [list, setList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const getListData = async () => {
    const res = await getRoleList(
      {
        pageNum: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
      { fullname }
    );
    if (res.code === 200) {
      setList(res.data.list);
      setTableParams({
        ...tableParams,
        pagination: { ...tableParams.pagination, total: res.data.total },
      });
    }
  };
  useEffect(() => {
    getListData();
  }, [
    fullname,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  const onFinish = async (values) => {
    const { fullname } = values;
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
    setFullname(fullname);
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "名称",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "权限",
      dataIndex: "permissionsName",
      key: "permissionsName",
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
                  onClick={() => handleClickPermissions(record.id)}
                >
                  设置权限
                </Button>
              </PermCom>
              <Button
                type="primary"
                onClick={() => handleClickAddEdit(record.id)}
              >
                修改
              </Button>
              <Popconfirm
                title="删除"
                description="确定要删除吗？"
                onConfirm={() => confirmDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>删除</Button>
              </Popconfirm>
            </Flex>
          </>
        );
      },
    },
  ];

  const handleChangePagination = (page, pageSize) => {
    setTableParams({
      pagination: { ...tableParams.pagination, current: page, pageSize },
    });
    setList([]);
  };

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

  const confirmDelete = async (id) => {
    const res = await deleteRole({ id });
    if (res.code === 200) {
      message.success("删除成功");
      refresh();
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      console.log(values);

      let formData = form.getFieldValue();
      console.log(formData);
      if (formData.id) {
        const res = await updateRole(formData);
        if (res.code === 200) {
          message.success("修改成功");
          setIsModalOpen(false);
          getListData();
        }
      } else {
        const res = await addRole(formData);
        if (res.code === 200) {
          message.success("新增成功");
          setIsModalOpen(false);
          getListData();
        }
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  const handleClickAddEdit = async (id) => {
    if (!id) {
      setIsModalOpen(true);
      form.resetFields();
      setCheckedKeys([]);
    } else {
      const res = await getRoleInfo({ id });
      if (res.code === 200) {
        setIsModalOpen(true);
        form.setFieldsValue(res.data);
        setCheckedKeys(res.data.permissionList);
      }
    }
  };

  const [menuTree, setMenuTree] = useState([]);
  // 获取所有菜单
  const getAllMenus = async () => {
    const res = await getMenuList();
    if (res.code === 200) {
      let tree = toTree(res.data);
      setMenuTree(tree);
    }
  };
  useEffect(() => {
    getAllMenus();
  }, []);
  const [checkedKeys, setCheckedKeys] = useState([]);

  const onCheckTree = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
  };

  // 设置权限 dialog 标识
  const [permissionModel, setPermissionModel] = useState(false);
  // 设置权限 表单实例
  const [permissionForm] = Form.useForm();
  // 回显权限表单数据
  const handleClickPermissions = async (id) => {
    const res = await getPermissionDetail({ id });
    if (res.code === 200) {
      setCheckedKeys(res.data.permissions?.split(",")?.map(v=>Number(v)));
      permissionForm.setFieldsValue({
        id: res.data.id,
        permissions: res.data.permissions?.split(",")?.map(v=>Number(v)),
      });
      setPermissionModel(true);
    }
  };
  // 提交设置角色数据
  const handlePermissionOk = async () => {
    permissionForm.validateFields().then(async () => {
      const formData = {
        id: permissionForm.getFieldValue("id"),
        permissions: checkedKeys,
      };
      const res = await editPermissions(formData);
      if (res.code === 200) {
        message.success("操作成功");
        setPermissionModel(false);
        getListData();
      }
    });
  };

  // 关闭设置角色 dialog
  const handlePermissionCancel = () => {
    setPermissionModel(false);
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="search-area">
          <Form
            name="basic"
            layout="inline"
            initialValues={{ fullname: "" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="名称" name="fullname">
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
            <Button type="primary" onClick={() => handleClickAddEdit()}>
              新增
            </Button>
          </Flex>
        </div>
        <div
          className="tableArea"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Table
            columns={columns}
            dataSource={list}
            rowKey={(record) => record.id}
            pagination={false}
            className="auto-height-table-no-pagination"
          />
          <Pagination
            total={tableParams.pagination.total}
            showSizeChanger
            current={tableParams.pagination.current}
            onChange={handleChangePagination}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          />
        </div>
      </div>

      <Modal
        title="编辑"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isModalOpen && (
          <Form
            form={form}
            initialValues={{ status: 0 }}
            labelCol={{ span: 6 }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="fullname"
              label="名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Segmented options={statusOptions} />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <Input.TextArea row={2} placeholder="请输入" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Drawer
        title="设置权限"
        onClose={handlePermissionCancel}
        open={permissionModel}
        extra={
          <Space>
            <Button onClick={handlePermissionCancel}>取消</Button>
            <Button type="primary" onClick={handlePermissionOk}>
              提交
            </Button>
          </Space>
        }
      >
          <Form
            form={permissionForm}
            labelCol={{ span: 6 }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="permissionList" label="权限">
              <Tree
                checkable
                treeData={menuTree}
                checkedKeys={checkedKeys}
                onCheck={onCheckTree}
                fieldNames={{ title: "fullname", key: "id" }}
              />
            </Form.Item>
          </Form>
      </Drawer>
    </>
  );
};

export default Role;
