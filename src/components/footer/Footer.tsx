import { FaGithub } from "react-icons/fa";
import { UpdateBanner } from "@/components/footer/UpdateBanner.tsx";
import { Link } from "@/components/shared/Link.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/components/useAuth.ts";
import { useVersions } from "@/components/useVersions.ts";

export function Footer() {
  const { appVersion, serverVersion } = useVersions();
  const { clearAuth, isAuthenticated } = useAuth();
  return (
    <footer className="mt-auto flex w-full max-w-sm flex-col gap-4 text-gray-500">
      {isAuthenticated && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={clearAuth}>
            Logout
          </Button>
        </div>
      )}
      {isAuthenticated && <UpdateBanner />}
      <div className="grid grid-cols-3 text-sm">
        <div className="truncate overflow-hidden text-end">UI: v{appVersion}</div>
        <Link
          href="https://github.com/Silvenga/rustypaste-ui"
          aria-label="Github Repository"
          className="flex justify-center text-gray-500 hover:text-gray-700 hover:no-underline dark:hover:text-gray-300"
        >
          <FaGithub className="size-5" />
        </Link>
        <div className="truncate overflow-hidden">
          Server:
          {serverVersion ? ` v${serverVersion}` : " unknown"}
        </div>
      </div>
    </footer>
  );
}
