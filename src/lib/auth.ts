import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";
import { useFinanceStore } from "@/context/useFinanceStore";


type User = { id: string; email: string; fullName: string };
type Session = { token: string; user: User };

type State = {
  user: User | null;
  token: string | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<State>((set) => {
  const guardar = async ({ token, user }: Session) => {
    await SecureStore.setItemAsync("session", JSON.stringify({ token, user }));
    set({ token, user });
  };

  return {
    user: null,
    token: null,
    loading: true,
    init: async () => {
      const raw = await SecureStore.getItemAsync("session");
      if (raw) set({ ...(JSON.parse(raw) as Session) });
      set({ loading: false });
    },
    login: async (email, password) =>
      guardar(await api<Session>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })),
    register: async (email, password, fullName) =>
      guardar(await api<Session>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, fullName }) })),
    logout: async () => {
      await SecureStore.deleteItemAsync("session");
       useFinanceStore.getState().reset();
      set({ token: null, user: null });
    },
  };
});