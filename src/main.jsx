import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@unocss/reset/normalize.css";
import "virtual:uno.css";
import "@/styles/reset.scss";
import "@/styles/index.scss";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
// svg图标
import 'virtual:svg-icons-register'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="luReactAdmin">
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
