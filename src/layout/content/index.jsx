import { Layout, theme } from "antd";
import { useOutlet, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
// import "./index.scss";
import { useRef } from "react";

// 使用react-spring
const Content = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const currentOutlet = useOutlet();
  // 解决CSSTransition抛出 findDOMNode is deprecated in StrictMode 错误
  const nodeRef = useRef(null);
  const location = useLocation();

  return (
    <Layout.Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        background: colorBgContainer,
      }}
    >
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          className="fade"
          timeout={300}
        >
          <>{currentOutlet}</>
        </CSSTransition>
      </SwitchTransition>
    </Layout.Content>
  );
};
export default Content;
