import { twMerge } from "tailwind-merge";
import { Link } from "@/components/shared/Link.tsx";
import { useUpdateAvailable } from "@/providers/UpdateAvailableProvider.tsx";

export function UpdateBanner() {
  const state = useUpdateAvailable();

  if (state.status === "update-available") {
    return (
      <div className="flex justify-center">
        <Link
          href={state.releaseUrl}
          className={twMerge(
            "text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
            "border rounded-full border-gray-300 dark:border-gray-700 px-2 py-1",
            "hover:no-underline",
          )}
        >
          UI v{state.latestVersion} Available
        </Link>
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
