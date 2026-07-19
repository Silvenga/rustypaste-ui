import { twMerge } from "tailwind-merge";
import { useUpdateAvailable } from "@/providers/UpdateAvailableProvider.tsx";

export function UpdateBanner() {
  const state = useUpdateAvailable();

  if (state.status === "update-available") {
    return (
      <div className="flex justify-center">
        <a
          href={state.releaseUrl}
          target="_blank"
          rel="external noopener noreferrer"
          className={twMerge(
            "text-xs text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline dark:hover:text-gray-300",
            "border rounded-full border-gray-300 dark:border-gray-700 px-2 py-1",
          )}
        >
          UI v{state.latestVersion} Available
        </a>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="flex justify-center">
        <span className="text-xs">Couldn&apos;t check for updates.</span>
      </div>
    );
  }
  return null;
}
