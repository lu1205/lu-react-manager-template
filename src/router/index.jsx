import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

const lazyComponent = (Component) => (
  <Suspense>
    <Component />
  </Suspense>
);
const Login = lazy(() => import("@/pages/login"));
const Layout = lazy(() => import("@/layout"));
const Home = lazy(() => import("@/pages/home"));

const routes = [
  {
    path: "login",
    name: "登录",
    element: lazyComponent(Login),
  },

  {
    path: "/",
    name: "首页",
    key: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        path: "home",
        name: "首页",
        key: "home",
        element: lazyComponent(Home),
      },
      {
        path: "/system",
        name: "系统设置",
        children: [
          {
            path: "user",
            name: "用户管理",
            key: "user",
            element: lazyComponent(lazy(() => import("@/pages/system/User"))),
          },
          {
            path: "role",
            name: "角色管理",
            key: "role",
            element: lazyComponent(lazy(() => import("@/pages/system/Role"))),
          },
          {
            path: "menu",
            name: "菜单管理",
            key: "menu",
            element: lazyComponent(lazy(() => import("@/pages/system/Menu"))),
          },
        ],
      },
      {
        path: "/monitor",
        name: "系统监控",
        children: [
          {
            path: "logs",
            name: "系统日志",
            key: "logs",
            element: lazyComponent(lazy(() => import("@/pages/monitor/Logs"))),
          },
        ],
      },
      {
        path: "/echarts",
        name: "Echarts",
        children: [
          {
            path: "mapChart",
            name: "3D地图",
            key: "mapChart",
            element: lazyComponent(
              lazy(() => import("@/pages/echarts/MapChart"))
            ),
          },
        ],
      },
      {
        path: "/table",
        name: "Table",
        children: [
          {
            path: "table1",
            name: "table1",
            key: "table1",
            element: lazyComponent(lazy(() => import("@/pages/table/Table1"))),
          },
          {
            path: "table2",
            name: "table2",
            key: "table2",
            element: lazyComponent(lazy(() => import("@/pages/table/Table2"))),
          },
          {
            path: "table3",
            name: "table3",
            key: "table3",
            element: lazyComponent(lazy(() => import("@/pages/table/Table3"))),
          },
          {
            path: "tablePro",
            name: "tablePro",
            key: "tablePro",
            element: lazyComponent(
              lazy(() => import("@/pages/table/TablePro"))
            ),
          },
        ],
      },
      {
        path: "/pdf",
        name: "PDF",
        children: [
          {
            path: "viewPdf",
            name: "viewPdf",
            key: "viewPdf",
            element: lazyComponent(lazy(() => import("@/pages/pdf/ViewPdf"))),
          },
          {
            path: "downloadPdf",
            name: "downloadPdf",
            key: "downloadPdf",
            element: lazyComponent(
              lazy(() => import("@/pages/pdf/DownloadPdf"))
            ),
          },
        ],
      },
    ],
  },
  {
    path: "notFound",
    name: "notFound",
    element: lazyComponent(lazy(() => import("@/pages/error/404"))),
  },
  {
    path: "error",
    name: "error",
    element: lazyComponent(lazy(() => import("@/pages/error/500"))),
  },
];

const StaticRoutes = () => {
  return useRoutes(routes);
};

export { StaticRoutes };
