import { useLocalStorage } from "usehooks-ts";
import { useMemo } from "react";

export type Auth = {
  token: string;
  instanceUrl: string;
}

export function useAuth() {
  const [authKey, setValue, removeValue] = useLocalStorage<Auth | undefined>("auth-key", undefined);
  return useMemo(() => ({
    authKey,
    isAuthenticated: !!authKey,
    setAuth: setValue,
    clearAuth: removeValue,
  }), [removeValue, setValue, authKey]);
}
