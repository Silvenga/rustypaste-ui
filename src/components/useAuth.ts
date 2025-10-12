import { useLocalStorage } from "usehooks-ts";
import { useMemo } from "react";

export type Auth = {
  token: string;
  instanceUrl: string;
}

export function useAuth() {
  const [authKey, setValue, removeValue] = useLocalStorage<Auth | undefined>("auth-key", undefined);
  return useMemo(() => ({
    authKey: {
      token: authKey?.token.trim() ?? "",
      instanceUrl: authKey?.instanceUrl.trim().replace(/\/+$/, "") ?? "",
    },
    isAuthenticated: !!authKey,
    setAuth: setValue,
    clearAuth: removeValue,
  }), [removeValue, setValue, authKey]);
}
