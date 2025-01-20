import { useState } from "react";
import { getUserList } from "../../api";
import { useEffect, useLayoutEffect } from "react";
import { Form, Input, Button, Table } from "antd";
import { useRef } from "react";

const Table3 = () => {
  const [username, setUsername] = useState("");
  const [list, setList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });
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
  useEffect(() => {
    getListData();
  }, [
    username,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
  ]);

  const onFinish = async (values) => {
    const { username } = values;
    setTableParams({
      ...tableParams,
      pagination: { ...tableParams.pagination, current: 1 },
    });
    setUsername(username);
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
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
  ];

  const handleTableChange = (pagination) => {
    setTableParams({ pagination });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setList([]);
    }
  };

  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);

  const resizeTable = (ref) => {
    if (tableParams.pagination.total === 0) return;
    const node = ref.current;
    if (node) {
      console.log(node.parentNode.offsetHeight);
      const tableOutHeight = getEleFullHeight(node.parentNode);

      const tableHeaderHeight = getEleFullHeight(
        node.nativeElement.querySelector(".ant-table-thead")
      );

      const tablePaginationHeight = getEleFullHeight(
        node.nativeElement.querySelector(".ant-pagination")
      );
      setTableHeight(
        tableOutHeight - tableHeaderHeight - tablePaginationHeight
      );
    }
  };

  const getEleFullHeight = (element) => {
    if (!element) return 0;
    let style = window.getComputedStyle(element);
    let marginTop = parseFloat(style.marginTop);
    let marginBottom = parseFloat(style.marginBottom);
    let heightWithPaddingAndBorder = element.offsetHeight;
    // console.log(heightWithPaddingAndBorder, marginTop, marginBottom);
    return heightWithPaddingAndBorder + marginTop + marginBottom;
  };

  useLayoutEffect(() => {
    resizeTable(tableRef);
  }, [tableParams.pagination.total]);

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
        <div className="tableArea" style={{ flex: 1, overflow: "hidden" }}>
          <Table
            ref={tableRef}
            columns={columns}
            dataSource={list}
            rowKey={(record) => record.id}
            pagination={{
              ...tableParams.pagination,
              showSizeChanger: true,
              showTotal: (total) =>`共 ${total} 条记录`,
            }}
            onChange={handleTableChange}
            scroll={{ y: tableHeight }}
          />
        </div>
      </div>
    </>
  );
};

export default Table3;
