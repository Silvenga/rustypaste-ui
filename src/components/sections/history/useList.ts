import { useEffect, useMemo, useState } from "react";
import { getList, type ListItem } from "@/api/getList.ts";
import { useAuth } from "@/components/useAuth.ts";
import { delay } from "@/delay.ts";
import useNetworkInformation from "@/hooks/use-network-information.ts";

const POLL_INTERVAL_MS = 1_000;

export function useList() {
  const { isOnline, isSupported } = useNetworkInformation();
  const [list, setList] = useState<ListItem[]>();
  const [isFetching, setIsFetching] = useState(true);

  const { authKey } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    void (async () => {
      while (!abortController.signal.aborted) {
        try {
          setIsFetching(true);
          const list = await getList({
            authToken: authKey.token,
            instanceUrl: authKey.instanceUrl,
            signal: abortController.signal,
          });
          setList(list);
        } catch (error) {
          if (abortController.signal.aborted) {
            return;
          }
          console.error("Failed to fetch list: ", error);
        } finally {
          setIsFetching(false);
        }
        await delay(POLL_INTERVAL_MS, abortController.signal);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [authKey.instanceUrl, authKey.token, isOnline, isSupported]);

  return useMemo(
    () => ({
      list: list ?? [],
      isFetching,
      isLoading: list == null,
    }),
    [isFetching, list],
  );
}
