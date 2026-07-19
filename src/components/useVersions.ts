import { getLogger } from "@logtape/logtape";
import { useEffect, useMemo, useState } from "react";
import { getVersion } from "@/api/getVersion.ts";
import { useAuth } from "@/components/useAuth.ts";

const logger = getLogger(["rustypaste-ui", "useVersions"]);

export function useVersions() {
  const [serverVersion, setServerVersion] = useState<string>();

  const { authKey } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    void (async () => {
      if (authKey) {
        setServerVersion("Loading...");
        try {
          const version = await getVersion({
            token: authKey.token,
            instanceUrl: authKey.instanceUrl,
            signal: abortController.signal,
          });
          setServerVersion(version);
        } catch (e) {
          logger.warn("Failed to get server version", { error: e });
          setServerVersion(undefined);
        }
      }
    })();
    return () => abortController.abort();
  }, [authKey]);

  return useMemo(() => {
    return {
      appVersion: (import.meta.env.VITE_APP_VERSION as string) ?? "0.0.1",
      serverVersion,
    };
  }, [serverVersion]);
}
