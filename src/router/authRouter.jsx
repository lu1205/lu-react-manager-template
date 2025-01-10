import { Navigate, useLocation } from "react-router-dom";
import useTokenStore from "@/stores/token";
import useMenuStore from "@/stores/menu";
import { shallow } from "zustand/shallow";

const AuthRouter = (props) => {
  const { pathname } = useLocation();
  const token = useTokenStore((state) => state.token, shallow);
  const routerList = useMenuStore((state) => state.routerList, shallow);

  const whiteList = ["/login", "/notFound", "/error"];

  // 白名单跳转
  if (whiteList.includes(pathname)) return props?.children;

  // 未登录跳转
  if (!token) return <Navigate to="/login" />;

  // 校验用户路由权限
  if (props?.children && routerList?.find((_) => _.routepath === pathname)) {
    return props?.children;
  } else {
    return <Navigate to="/notFound" replace />;
  }
  // return props?.children || <Navigate to="/NotFound" />;
};

export default AuthRouter;
