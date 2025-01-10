import { useState, useEffect } from "react";

import { Layout } from "antd";

import Slide from "./slide";
import Header from "./header";
import Content from "./content";
import useMenuStore from "@/stores/menu";
import { toTree } from "@/utils/common";

import { useLoadPermissionData } from "@/hooks/useLoadPermissionData";
import SvgIcon from "../components/SvgIcon";

const handleIcon = (name) => (
  // <i className={`iconfont ${name} w-[16px] h-[16px]`}></i>
  <SvgIcon iconName={name} /> 
);

const handleLink = (linkurl, name) => (
  <a href={linkurl} target="_blank" rel="noopener noreferrer">
    {name}
  </a>
);
const Layouts = () => {
  const getPermissionData = useLoadPermissionData();

  useEffect(() => {
    getPermissionData();
  }, []);

  // zustand 读取的数据为只读的，修改时需要重新拷贝数据
  const items = toTree(
    useMenuStore((state) => state.routerList).map((item) => {
      const icon = handleIcon(item.icon);
      const label = item.islink
        ? handleLink(item.linkurl, item.label)
        : item.label;
      return {
        ...item,
        icon,
        label,
      };
    })
  );

  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="w-[100%] h-[100%]">
      <Slide items={items} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content />
      </Layout>
    </Layout>
  );
};
export default Layouts;
