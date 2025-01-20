import { useState } from "react";
import { getLogList, getLogInfo } from "../../api";
import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Pagination,
  Flex,
  Drawer,
  Row,
  Col,
} from "antd";
import { statusOptions } from "../../enums/index";

const Logs = () => {
  const [module, setModuleName] = useState("");
  const [list, setList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const getListData = async () => {
    const res = await getLogList(
      {
        pageNum: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
      { module }
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
    module,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  const onFinish = async (values) => {
    const { module } = values;
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
    setModuleName(module);
  };

  const columns = [
    {
      title: "操作人",
      dataIndex: "username",
      minWidth: 80,
    },
    {
      title: "登录IP",
      dataIndex: "ip",
      minWidth: 130,
    },
    {
      title: "操作模块",
      dataIndex: "module",
      minWidth: 90,
    },
    {
      title: "操作类型",
      dataIndex: "type",
      minWidth: 100,
    },
    {
      title: "请求类型",
      dataIndex: "method",
      minWidth: 90,
    },
    {
      title: "请求地址",
      dataIndex: "path",
      minWidth: 200,
    },
    {
      title: "请求query",
      dataIndex: "query",
      minWidth: 120,
    },
    {
      title: "请求params",
      dataIndex: "params",
      minWidth: 120,
    },
    {
      title: "请求body",
      dataIndex: "body",
      minWidth: 120,
    },
    {
      title: "操作结果类型",
      dataIndex: "resultType",
      minWidth: 120,
      render: (text, record, index) => {
        return { 1: "操作成功", 0: "操作失败" }[record.resultType];
      },
    },
    {
      title: "操作结果",
      dataIndex: "result",
      minWidth: 100,
    },
    {
      title: "浏览器信息",
      dataIndex: "browser",
      minWidth: 160,
    },
    {
      title: "操作系统",
      dataIndex: "os",
      minWidth: 120,
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      minWidth: 190,
    },
    {
      title: "操作结果时间",
      dataIndex: "updateTime",
      minWidth: 190,
    },
    {
      title: "操作",
      minWidth: 100,
      fixed: "right",
      render: (text, record, index) => {
        return (
          <>
            <Flex gap="small">
              <Button
                type="primary"
                onClick={() => handleClickDetail(record.uuid)}
              >
                详情
              </Button>
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

  const [detailModel, setDetailModel] = useState(false);
  const [logDetail, setLogDetail] = useState(false);
  // 回显权限表单数据
  const handleClickDetail = async (uuid) => {
    const res = await getLogInfo({ uuid });
    if (res.code === 200) {
      setLogDetail(res.data);
      setDetailModel(true);
    }
  };

  // 关闭设置角色 dialog
  const closeDetailModel = () => {
    setDetailModel(false);
  };
  const itemStyle = {
    backgroundColor: "#e5e9f2",
    borderRadius: "4px",
    padding: "8px",
    marginBottom: "10px",
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="search-area">
          <Form
            name="basic"
            layout="inline"
            initialValues={{ module: "" }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item label="模块名称" name="module">
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
            rowKey={(record) => record.uuid}
            pagination={false}
            className="auto-height-table-no-pagination"
          />
          <Pagination
            total={tableParams.pagination.total}
            showTotal={(total) => `共 ${total} 条记录`}
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

      <Drawer title="详情" onClose={closeDetailModel} open={detailModel}>
        <div>
          <Row style={itemStyle}>
            <Col span={8}>操作人：</Col>
            <Col span={16}>{logDetail.username}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>登录IP：</Col>
            <Col span={16}>{logDetail.ip}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作模块：</Col>
            <Col span={16}>{logDetail.module}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作类型：</Col>
            <Col span={16}>{logDetail.type}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>请求类型：</Col>
            <Col span={16}>{logDetail.method}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>请求地址：</Col>
            <Col span={16}>{logDetail.path}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>请求query：</Col>
            <Col span={16}>{logDetail.query}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>请求params：</Col>
            <Col span={16}>{logDetail.params}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>请求body：</Col>
            <Col span={16}>{logDetail.body}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作结果类型：</Col>
            <Col span={16}>
              {logDetail.resultType === 1 ? "操作成功" : "操作失败"}
            </Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作结果：</Col>
            <Col span={16}>{logDetail.result}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>浏览器信息：</Col>
            <Col span={16}>{logDetail.browser}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作系统：</Col>
            <Col span={16}>{logDetail.os}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作时间：</Col>
            <Col span={16}>{logDetail.createTime}</Col>
          </Row>
          <Row style={itemStyle}>
            <Col span={8}>操作结果时间：</Col>
            <Col span={16}>{logDetail.updateTime}</Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};

export default Logs;
