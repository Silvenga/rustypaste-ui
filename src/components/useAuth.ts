import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useAuth() {
  const [auth, setValue, removeValue] = useLocalStorage<Auth | undefined>("auth-key", undefined);
  const clearAuth = useCallback(() => {
    localStorage.clear();
    // This must be called, since it emits a synthetic event to notify other consumers.
    removeValue();
  }, [removeValue]);
  return useMemo(
    () => ({
      authKey: {
        token: auth?.token.trim() ?? "",
        instanceUrl: auth?.instanceUrl.trim().replace(/\/+$/, "") ?? "",
        checkForReleases: auth?.checkForReleases ?? true,
      },
      isAuthenticated: !!auth,
      setAuth: setValue,
      clearAuth,
    }),
    [auth, clearAuth, setValue],
  );
}

type Auth = {
  token: string;
  instanceUrl: string;
  /** Optional; defaults to `true` when absent. Wiped on logout. */
  checkForReleases?: boolean;
};
