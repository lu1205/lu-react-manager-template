import { getPermissionList } from "@/api";
import useMenuStore from "@/stores/menu";
import { toTree } from "@/utils/common";

export function useLoadPermissionData() {
  const [setMenuList, setPersList, setRouterList] = useMenuStore((state) => [
    state.setMenuList,
    state.setPersList,
    state.setRouterList,
  ]);

  const getPermissionData = async () => {
    const res = await getPermissionList();
    if (res.code === 200) {
      let routerList = res.data.routerList
        ?.map((v) => {
          let result = {};
          Object.keys(v).forEach((key) => {
            result[key.toLowerCase()] = v[key];
          });

          return {
            ...result,
            path: result.path,
            label: result.fullname,
          };
        })
        ?.map((v) => {
          return {
            ...v,
            key: v.path,
            // key: v.id + '',
            routepath: v.islink ? null : v.path || "",
            path: v.path,
            label: v.fullname,
          };
        })
        .filter((v) => v.type !== "B");

      setRouterList(routerList);
      setMenuList(toTree(routerList));
      setPersList(res.data.persList);
    }
  };

  return getPermissionData;
}
