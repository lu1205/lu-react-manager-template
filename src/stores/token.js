import { createWithEqualityFn } from "zustand/traditional";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import useUserStore from "@/stores/user";
import useMenuStore from "@/stores/menu";
import { shallow } from "zustand/shallow";

const useTokenStore = createWithEqualityFn(
  devtools(
    persist(
      immer((set) => ({
        token: "",
        setToken: (data) =>
          set((state) => {
            state.token = data;
          }),
        removeToken: () =>
          set((state) => {
            const removeUser = useUserStore.getState().removeUser;
            const removeMenuList = useMenuStore.getState().removeMenuList;
            const removePersList = useMenuStore.getState().removePersList;
            const removeRouterList = useMenuStore.getState().removeRouterList;
            state.token = "";
            removeUser();
            removeMenuList();
            removePersList();
            removeRouterList();
          }),
      })),
      {
        name: "token",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  ),
  shallow
);
export default useTokenStore;
