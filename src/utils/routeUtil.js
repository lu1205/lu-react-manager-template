import useMenuStore from "@/stores/menu";
export const findRoute = (
  currentPath,
  data = useMenuStore.getState().menuList
) => {
  let arr = [];
  for (const i in data) {
    const item = data[i];
    console.log("item", item, currentPath);

    if (item.key === currentPath) {
      return [item];
    }
    if (item.children && item.children.length > 0) {
      const item2 = findRoute(currentPath, item.children);
      if (item2 !== undefined) {
        arr = item2.concat(item);
      }
    }
  }
  return arr;
};

export const findParentAndChild = (
  targetKey,
  menu = useMenuStore.getState().menuList
) => {
  let result = [];

  function search(item) {
    if (item.key === targetKey) {
      // 当前项就是目标项，将当前项和其父节点一起返回
      result.push(item, ...(item.children || []));
      return true;
    }

    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        if (search(child)) {
          // 如果在子项中找到了目标项，则将当前项添加到结果中
          result.unshift(item);
          return true;
        }
      }
    }

    return false;
  }

  menu.forEach((item) => {
    search(item);
  });

  return result;
};
