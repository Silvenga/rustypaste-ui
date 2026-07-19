import { useCallback, useEffect, useState } from "react";

export const TabNames = {
  files: "files",
  url: "url",
  history: "history",
} as const;

const VALID_TABS = Object.values(TabNames);
type TabValue = (typeof VALID_TABS)[number];

function readHash(): TabValue {
  const hash = window.location.hash.replace(/^#/, "");
  return VALID_TABS.includes(hash as TabValue) ? (hash as TabValue) : TabNames.files;
}

export function useHashRoute(): [TabValue, (next: string) => void] {
  const [value, setValue] = useState<TabValue>(() => readHash());

  useEffect(() => {
    const onHashChange = () => setValue(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setRoute = useCallback((next: string) => {
    const valid = VALID_TABS.includes(next as TabValue) ? (next as TabValue) : TabNames.files;
    if (window.location.hash === `#${valid}`) return;
    window.history.replaceState(null, "", `#${valid}`);
    setValue(valid);
  }, []);

  return [value, setRoute];
}
