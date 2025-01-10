import { createWithEqualityFn } from "zustand/traditional";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { shallow } from "zustand/shallow";

const useUserStore = createWithEqualityFn(
  devtools(
    persist(
      immer((set) => ({
        user: {
          name: "",
          email: "",
          username: "admin",
          password: "123456",
          remember: true,
        },
        setUser: (data) =>
          set((state) => {
            state.user = data;
          }),
        removeUser: () =>
          set((state) => {
            state.user = {
              name: "",
              email: "",
              username: "admin",
              password: "123456",
              remember: true,
            };
            if (!state.user.remember) {
              state.user.username = "";
              state.user.password = "";
              state.user.remember = false;
            }
          }),
      })),
      {
        name: "user",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  ),
  shallow
);

export default useUserStore;
