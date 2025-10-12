import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/useAuth.ts";
import { getVersion } from "@/api/getVersion.ts";

export function useVersions() {

  const [serverVersion, setServerVersion] = useState("<unknown>");

  const { authKey } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    void (async () => {
      if (authKey) {
        setServerVersion("Loading...");
        try {
          const version = await getVersion({
            authToken: authKey.token,
            instanceUrl: authKey.instanceUrl,
            signal: abortController.signal,
          });
          setServerVersion(version);
        } catch (e) {
          console.warn("Failed to get server version", e);
          setServerVersion("<error>");
        }
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [authKey]);

  return useMemo(() => {
    return {
      appVersion: import.meta.env.VITE_APP_VERSION as string ?? "0.0.1",
      serverVersion,
    };
  }, [serverVersion]);
}
