import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api } from "./api";


type User = { id: string; email: string; fullName: string };
type Session = { token: string; user: User };

type State = {
  user: User | null;
  token: string | null;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, acceptedTerms: boolean) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;

};

export const useAuth = create<State>((set, get) => {
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
    register: async (email, password, fullName, acceptedTerms) =>
      guardar(await api<Session>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, fullName, acceptedTerms }) })),
    logout: async () => {
      await SecureStore.deleteItemAsync("session");
      set({ token: null, user: null });
    },
    deleteAccount: async (password) => {
  await api("/api/account/delete", { method: "POST", body: JSON.stringify({ password }) }, get().token);
},
  };
});
