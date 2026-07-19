import { compareVersions, validate } from "compare-versions";
import { type PropsWithChildren, createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { getLatestRelease } from "@/api/getLatestRelease.ts";
import { useAuth } from "@/components/useAuth.ts";
import useNetworkInformation from "@/hooks/use-network-information.ts";

const CACHE_KEY = "update-check-cache";
const CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "0.0.1";

export type UpdateAvailableState =
  | { status: "idle" }
  | { status: "update-available"; latestVersion: string; releaseUrl: string }
  | { status: "error" };

type CachedResult =
  | { status: "ok"; latestVersion: string; releaseUrl: string; checkedAt: number }
  | { status: "error"; checkedAt: number };

const UpdateAvailableContext = createContext<UpdateAvailableState>({ status: "idle" });

export function UpdateAvailableProvider({ children }: PropsWithChildren) {
  const { isAuthenticated, authKey } = useAuth();
  const { isOnline } = useNetworkInformation();
  const [cached, setCached] = useLocalStorage<CachedResult | undefined>(CACHE_KEY, undefined);

  const enabled = isAuthenticated && authKey.checkForReleases;
  const isFresh = cached && Date.now() - cached.checkedAt < CACHE_TTL_MS ? cached : null;
  const needsFetch = enabled && isOnline && !isFresh;

  useEffect(() => {
    if (!needsFetch) {
      return;
    }
    const abortController = new AbortController();
    void (async () => {
      try {
        const release = await getLatestRelease(abortController.signal);
        if (abortController.signal.aborted) return;
        if (!validate(release.version) || !validate(APP_VERSION)) {
          setCached({ status: "error", checkedAt: Date.now() });
          return;
        }
        setCached({
          status: "ok",
          latestVersion: release.version,
          releaseUrl: release.releaseUrl,
          checkedAt: Date.now(),
        });
      } catch {
        if (abortController.signal.aborted) {
          return;
        }
        setCached({ status: "error", checkedAt: Date.now() });
      }
    })();
    return () => abortController.abort();
  }, [needsFetch, setCached]);

  const state = useMemo<UpdateAvailableState>(() => {
    if (!enabled) {
      return { status: "idle" };
    }
    if (isFresh?.status === "ok") {
      if (compareVersions(isFresh.latestVersion, APP_VERSION) > 0) {
        return {
          status: "update-available",
          latestVersion: isFresh.latestVersion,
          releaseUrl: isFresh.releaseUrl,
        };
      }
      return { status: "idle" };
    }
    if (isFresh?.status === "error" || (!isFresh && !isOnline)) {
      return { status: "error" };
    }
    return { status: "idle" };
  }, [enabled, isFresh, isOnline]);

  return (
    <UpdateAvailableContext.Provider value={state}>{children}</UpdateAvailableContext.Provider>
  );
}

export function useUpdateAvailable(): UpdateAvailableState {
  return useContext(UpdateAvailableContext);
}
