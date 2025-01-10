import useMenuStore from "@/stores/menu";

const PermCom = (props) => {
  const { persList } = useMenuStore((state) => state);
  // 超级管理员
  if (persList.length === 1 && persList[0] === "*") return props.children;

  // 字符串类型
  if (typeof props.roles === "string") {
    return persList?.includes(props.roles) ? props.children : <></>;
  }

  if (props.roles instanceof Array) {
    return props.roles?.every((item) => persList.includes(item)) ? (
      props.children
    ) : (
      <></>
    );
  }

  // return (persList.length === 1 && persList[0] === "*") ||
  //   persList?.includes(props.role) ? (
  //   props.children
  // ) : (
  //   <></>
  // );
};

export default PermCom;
