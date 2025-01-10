import { Tooltip } from "antd";
import SvgIcon from "../SvgIcon";
const IconButton = (props) => {
  const iconWrapStyle = {
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: "1px solid #e0e0e0",
    cursor: "pointer",
  };

  const iconName = props.iconName;
  const placement = props.placement || "top";
  const title = props.title || "";

  return (
    <Tooltip placement={placement} title={title}>
      <div style={iconWrapStyle} onClick={props.onClick}>
        <SvgIcon iconName={iconName} />
      </div>
    </Tooltip>
  );
};

export default IconButton;
