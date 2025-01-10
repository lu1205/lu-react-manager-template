import { ProTable } from "@ant-design/pro-components";
import { Button, Input } from "antd";
import { getUserList } from "../../api";
import {
  useEffect,
  useRef,
  useForwardRef,
  useState,
  useLayoutEffect,
} from "react";

const TablePro = () => {
  const columns = [
    {
      title: "序号",
      key: "index",
      dataIndex: "index",
      valueType: "indexBorder",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      renderFormItem: (item, { fieldProps }) => {
        return (
          <Input
            // 组件的配置
            {...fieldProps}
            // 自定义配置
            placeholder="请输入"
          />
        );
      },
    },
    {
      title: "密码",
      dataIndex: "password",
      key: "password",
      hideInSearch: true,
    },
  ];

  const getDataList = async (params) => {
    const res = await getUserList(
      {
        pageNum: params.current,
        pageSize: params.pageSize,
      },
      { username: params.username }
    );
    if (res.code === 200) {
      return {
        data: res.data.list,
        success: true,
        total: res.data.total,
      };
    } else {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const tableOutRef = useRef();
  const [tableHeight, setTableHeight] = useState(400);
  const getEleFullHeight = (element) => {
    if (!element) return 0;
    let style = window.getComputedStyle(element);
    let marginTop = parseFloat(style.marginTop);
    let marginBottom = parseFloat(style.marginBottom);
    let heightWithPaddingAndBorder = element.offsetHeight;
    // console.log(heightWithPaddingAndBorder, marginTop, marginBottom);
    return heightWithPaddingAndBorder + marginTop + marginBottom;
  };

  const computedTableHeight = () => {
    const node = tableOutRef.current;
    if (node) {
      const tableOutHeight = node.offsetHeight;

      const tableSearchHeight = getEleFullHeight(
        node.querySelector(".ant-pro-table-search")
      );

      const tableToobarHeight = getEleFullHeight(
        node.querySelector(".ant-pro-table-list-toolbar")
      );

      const tableHeaderHeight = getEleFullHeight(
        node.querySelector(".ant-table-header")
      );

      const tablePaginationHeight = getEleFullHeight(
        node.querySelector(".ant-table-pagination")
      );

      let style = window.getComputedStyle(
        node.querySelector(".ant-pro-card-body")
      );
      let marginTop = parseFloat(style.marginTop);
      let marginBottom = parseFloat(style.marginBottom);
      let paddingTop = parseFloat(style.paddingTop);
      let paddingBottom = parseFloat(style.paddingBottom);
      let cardBodyPaddingAndMarginHeight =
        marginTop + marginBottom + paddingTop + paddingBottom;

      // console.log(node.querySelector(".ant-table-pagination"));

      // console.log(
      //   tableOutHeight,
      //   tableSearchHeight,
      //   tableToobarHeight,
      //   tableHeaderHeight,
      //   tablePaginationHeight,
      //   cardBodyPaddingAndMarginHeight
      // );

      setTableHeight(
        tableOutHeight -
          tableSearchHeight -
          tableToobarHeight -
          tableHeaderHeight -
          tablePaginationHeight -
          cardBodyPaddingAndMarginHeight -
          2
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      computedTableHeight();
    }, 50);
  });

  return (
    <div className="page-wrapper" ref={tableOutRef}>
      <ProTable
        columns={columns}
        scroll={{ y: tableHeight }}
        cardBordered
        request={getDataList}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        // options={{
        //   setting: {
        //     listsHeight: 400,
        //   },
        // }}
        // search={false}
        options={false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          // onChange: (page, pageSize) => console.log("page", page, pageSize),
        }}
        dateFormatter="string"
      />
    </div>
  );
};

export default TablePro;
