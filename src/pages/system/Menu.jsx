import { useState } from "react";
import {
  getMenuList,
  getMenuInfo,
  addMenu,
  updateMenu,
  deleteMenu,
} from "@/api";
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Flex,
  Popconfirm,
  Modal,
  Radio,
  TreeSelect,
  message,
  Segmented,
} from "antd";
import { toTree } from "@/utils/common";
import { SwapOutlined, InfoCircleOutlined } from "@ant-design/icons";
import SvgIcon from "../../components/SvgIcon";
import IconButton from "../../components/IconButton";
import { statusOptions, keepAliveOptions, yesOrNoOptions } from "@/enums/index";
const Menu = () => {
  const [list, setList] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [expandable, setExpandable] = useState({
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],
  });

  // 原始菜单数据，用于提交表单中切换类型时筛选所属上级数据
  const [sourceMenu, setSourceMenu] = useState([
    { id: 0, pid: null, fullname: "根目录", type: "F" },
  ]);
  const [treeData, setTreeData] = useState([]);

  // 获取菜单数据
  const getListData = async () => {
    const res = await getMenuList();
    if (res.code === 200) {
      setSourceMenu([
        { id: 0, pid: null, fullname: "根目录", type: "F" },
        ...res.data?.filter((v) => v.type !== "B"),
      ]);
      const tree = toTree(
        res.data?.map((v) => ({
          ...v,
          title: v.menuName,
          key: v.id,
          parentid: v.parentId,
        }))
      );
      setList(tree);
      setTableKey(Date.now());
      // setExpandable({
      //   defaultExpandedRowKeys: tree?.map((item) => item.id),
      // });
    }
  };
  useEffect(() => {
    getListData();
  }, []);

  const columns = [
    {
      title: "名称",
      dataIndex: "fullname",
      key: "fullname",
      width: 240,
      fixed: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 60,
      render: (text, record, index) => {
        return { F: "目录", M: "菜单", B: "按钮" }[record.type];
      },
    },
    {
      title: "路由",
      dataIndex: "path",
      key: "path",
      width: 180,
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 60,
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      width: 60,
      render: (text, record, index) => {
        return <SvgIcon iconName={record.icon} />;
      },
    },
    {
      title: "权限标识",
      dataIndex: "permissionCode",
      key: "permissionCode",
      width: 160,
    },
    {
      title: "组件路径",
      dataIndex: "component",
      key: "component",
      width: 160,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 60,
      render: (text, record, index) => {
        return record.status === 0 ? "启用" : "禁用";
      },
    },
    {
      title: "操作",
      width: 200,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Flex gap="small">
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

  const confirmDelete = async (id) => {
    const res = await deleteMenu({ id });
    if (res.code === 200) {
      message.success("删除成功");
      getListData();
    }
  };

  const refresh = () => {
    getListData();
  };

  // 打开表单
  const handleClickAddEdit = async (id) => {
    if (!id) {
      setType("F");
      setSelectParentId("");
      setIsLink(0);
      form.resetFields();
      setIsModalOpen(true);
    } else {
      const res = await getMenuInfo({ id });
      if (res.code === 200) {
        setType(res.data.type);
        setSelectParentId(res.data.pid);
        setIsLink(res.data.isLink);
        form.setFieldsValue(res.data);
        setIsModalOpen(true);
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const initValue = {
    id: null,
    pid: null,
    fullname: null,
    path: null,
    sort: null,
    icon: null,
    component: null,
    type: null,
    status: 0,
    keepAlive: 0,
    permissionCode: null,
    isLink: 0,
    linkUrl: null,
  };
  // 提交表单
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      console.log("values", values);
      let id = form.getFieldValue("id");
      let formData = {
        ...values,
        type: type,
        pid: selectParentId,
        isLink: isLink,
      };
      console.log("formData", formData);
      if (id) {
        // 修改
        const res = await updateMenu({ ...formData, id });
        if (res.code === 200) {
          message.success("修改成功");
          getListData();
          setIsModalOpen(false);
        }
      } else {
        const res = await addMenu(formData);
        if (res.code === 200) {
          message.success("新增成功");
          getListData();
          setIsModalOpen(false);
        }
      }
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const changeExpandAll = (flag) => {
    setTableKey(Date.now());
    setExpandable({
      defaultExpandAllRows: flag,
    });
  };

  const [selectParentId, setSelectParentId] = useState("");

  // 选择所属上级
  const onChangeTreeSelect = (value) => {
    setSelectParentId(value);
  };

  const [type, setType] = useState("F");

  // 切换菜单类型
  const onChangeMenuType = (e) => {
    const value = e.target.value;
    setType(value);
    setSelectParentId("");
    if (value !== "M") {
      setIsLink(0);
    }
  };

  // 回显时自动处理数据
  useEffect(() => {
    // if (type === "F") {
    //   setTreeData([]);
    // } else {
    const treeDataValue = toTree(
      sourceMenu?.map((v) => ({
        ...v,
        title: v.fullname,
        disabled:
          type === "M" || type === "F"
            ? v.type === "M"
            : type === "B"
            ? v.type === "F"
            : false,
        // selectable:
        //   type === "M"
        //     ? v.type !== "M"
        //     : type === "B"
        //     ? v.type !== "F"
        //     : false,
        key: v.id,
        value: v.id,
        // parentid: v.parentId,
      }))
    );
    setTreeData(treeDataValue);
    // }
  }, [type, sourceMenu]);

  const [isLink, setIsLink] = useState(0);

  // 切换是否为外链
  const changeIsLink = (e) => {
    // Segmented
    setIsLink(e);

    // radio-group
    // setIsLink(e.target.value);
  };
  useEffect(() => {
    if (isModalOpen && isLink === 0) {
      form.setFieldValue("linkUrl", "");
    }
  }, [isModalOpen, isLink]);

  return (
    <>
      <div className="page-wrapper">
        <div className="mb-[10px] flex justify-end">
          <Flex gap="small">
            {/* <IconButton
              title="展开/收起"
              iconName="Change"
              onClick={() => changeExpandAll(!expandable.defaultExpandAllRows)}
            />
            <IconButton
              title="刷新"
              iconName="Refresh"
              onClick={() => refresh()}
            />
            <IconButton
              title="新增"
              iconName="Add"
              onClick={() => handleClickAddEdit()}
            /> */}
            <Button
              type="primary"
              onClick={() => changeExpandAll(!expandable.defaultExpandAllRows)}
            >
              <SvgIcon iconName="Change" />
              {!expandable?.defaultExpandAllRows ? "展开" : "收起"}
            </Button>
            <Button type="primary" onClick={() => refresh()}>
              <SvgIcon iconName="Refresh" />
              刷新
            </Button>
            <Button type="primary" onClick={() => handleClickAddEdit()}>
              <SvgIcon iconName="Add" />
              新增
            </Button>
          </Flex>
        </div>
        <div className="tableArea" style={{ flex: 1, overflow: "hidden" }}>
          <Table
            key={tableKey}
            columns={columns}
            dataSource={list}
            pagination={false}
            rowKey={(record) => record.id}
            scroll={{ x: "max-content", y: 660 }}
            expandable={expandable}
          />
        </div>
      </div>
      <Modal
        title="编辑"
        width="800px"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isModalOpen && (
          <Form
            form={form}
            layout="inline"
            initialValues={initValue}
            labelCol={{ span: 6 }}
          >
            <Form.Item
              className="w-full me-[0!important] mb-[20px!important]"
              labelCol={{ span: 3 }}
              label="类型"
              rules={[{ required: true, message: "请选择类型" }]}
            >
              <Radio.Group
                buttonStyle="solid"
                value={type}
                onChange={onChangeMenuType}
              >
                <Radio.Button value="F">目录</Radio.Button>
                <Radio.Button value="M">菜单</Radio.Button>
                <Radio.Button value="B">按钮</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              name="pid"
              label="所属上级"
              rules={[{ required: true }]}
            >
              <TreeSelect
                style={{ width: "100%" }}
                value={selectParentId}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={treeData}
                placeholder="请选择"
                onChange={onChangeTreeSelect}
              />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              name="fullname"
              label="名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type === "B"}
              name="path"
              label="路由"
              tooltip={{
                title: "菜单路由",
                icon: <InfoCircleOutlined />,
              }}
              rules={[{ required: type !== "B" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              name="sort"
              label="排序"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type !== "M"}
              name="component"
              label="组件路径"
              rules={[{ required: type === "M" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type === "B"}
              name="icon"
              label="图标"
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type !== "B"}
              name="permissionCode"
              label="权限标识"
              rules={[{ required: type === "B" }]}
            >
              <Input />
            </Form.Item>
            {/* {type === "M" && (
              <>
                <Form.Item label="是否外链">
                  <Radio.Group
                    defaultValue={0}
                    onChange={changeIsLink}
                    value={isLink}
                  >
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                  </Radio.Group>
                </Form.Item>
                {isLink === 1 && (
                  <Form.Item preserve={false} name="linkUrl" label="外链路径">
                    <Input />
                  </Form.Item>
                )}
              </>
            )} */}
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type !== "M"}
              label="是否外链"
            >
              <Segmented
                value={isLink}
                onChange={changeIsLink}
                options={yesOrNoOptions}
              />
              {/* <Radio.Group
                defaultValue={0}
                onChange={changeIsLink}
                value={isLink}
              >
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group> */}
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={isLink !== 1}
              name="linkUrl"
              label="外链路径"
              rules={[{ required: isLink === 1 }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              name="status"
              label="状态"
            >
              <Segmented options={statusOptions} />
            </Form.Item>
            <Form.Item
              className="w-[50%] me-[0!important] mb-[20px!important]"
              hidden={type !== "M"}
              name="keepAlive"
              label="是否缓存"
            >
              <Segmented options={keepAliveOptions} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Menu;
