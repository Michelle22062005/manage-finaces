import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { User } from '@/types/user';

type AuthStore = {
  user: User | null;
  signIn: (email: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo<AuthStore>(
    () => ({
      user,
      signIn: (email) =>
        setUser({
          email,
          name: email.split('@')[0] || 'Usuario',
        }),
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const state = useContext(AuthContext);
  if (!state) {
    throw new Error('useAuthStore debe usarse dentro de AuthStoreProvider.');
  }
  return selector(state);
}
