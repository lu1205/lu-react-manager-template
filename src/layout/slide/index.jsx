import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "@/assets/defaultImg/lu.png";
import { useEffect, useState } from "react";
import { findParentAndChild } from "@/utils/routeUtil";

const Slide = (props) => {
  const { items, collapsed, setCollapsed } = props;
  const navigator = useNavigate();
  const clickMenu = (val) => {
    const { item } = val;
    const islink = item.props.islink;
    const routepath = item.props.routepath;
    if (!islink) {
      routepath && navigator(routepath);
    }
  };
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  // 设置选中菜单
  useEffect(() => {
    // let arr = findParentAndChild(location.pathname);
    // setSelectedPath(arr[arr.length - 1].key);

    setSelectedPath(location.pathname);
  }, [location.pathname]);

  // 设置默认展开菜单
  let arr = findParentAndChild(location.pathname);

  const openKeys = arr.length ? [arr[0]?.key] : [];

  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="60"
      onBreakpoint={(broken) => setCollapsed(broken)}
    >
      <div className="w-[100%] flex justify-center items-center py-[16px]">
        <img src={icon} className="w-[60px] h-[60px]" alt="" />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={openKeys}
        selectedKeys={[selectedPath]}
        items={items}
        onClick={(item) => clickMenu(item)}
      />
    </Layout.Sider>
  );
};
export default Slide;
