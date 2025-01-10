const SvgIcon = (props) => {
  const svgStyle = {
    width: "1em",
    height: "1em",
    position: "relative",
    fill: "currentColor",
    verticalAlign: "-2px",
  };

  const svgClass = `${props.className}`;
  const iconName = `#icon-${props.iconName}`;
  const color = props.color || "";

  return (
    <svg className={svgClass} style={svgStyle} aria-hidden="true">
      <use xlinkHref={iconName} fill={color} />
    </svg>
  );
};

export default SvgIcon;
