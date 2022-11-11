import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const authStore = (set) => ({
  userDetails: {},

  setUserDetails: (user) =>
    set((state) => ({
      userDetails: user,
    })),
});

const useUserStore = create(
  devtools(
    persist(authStore, {
      name: "user",
    })
  )
);

export default useUserStore;
