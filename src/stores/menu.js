import { createWithEqualityFn } from "zustand/traditional";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";

const useMenuStore = createWithEqualityFn(
  devtools(
    persist(
      immer((set) => ({
        routerList: [],
        menuList: [],
        persList: [],
        setRouterList: (data) =>
          set((state) => {
            state.routerList = [{ key: 0,routepath: '/', label: "首页" }, ...data];
          }),
        removeRouterList: () =>
          set((state) => {
            state.routerList = [];
          }),
        setMenuList: (data) =>
          set((state) => {
            state.menuList = data;
          }),
        removeMenuList: () =>
          set((state) => {
            state.menuList = [];
          }),
        setPersList: (data) =>
          set((state) => {
            state.persList = data;
          }),
        removePersList: () =>
          set((state) => {
            state.persList = [];
          }),
      })),
      {
        name: "menuList",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  ),
  shallow
);
export default useMenuStore;
