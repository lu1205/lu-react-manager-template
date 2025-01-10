import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const Loading = () => <Spin className="loading-box" indicator={antIcon} />;

export default Loading;
