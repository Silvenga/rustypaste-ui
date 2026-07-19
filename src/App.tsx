import { FaGithub } from "react-icons/fa";
import { AuthGuard } from "@/components/AuthGuard.tsx";
import { Sections } from "@/components/Sections.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/components/useAuth.ts";
import { useVersions } from "@/components/useVersions.ts";
import logo from "./assets/rustypaste-logo.webp";

export function App() {
  const { appVersion, serverVersion } = useVersions();
  const { clearAuth, isAuthenticated } = useAuth();
  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center gap-4 p-4 select-none">
      <section className="mt-8 flex justify-center">
        <img src={logo} alt="Rustypaste Logo" className="h-16 w-auto" />
      </section>
      <AuthGuard>
        <Sections />
      </AuthGuard>
      <footer className="mt-auto flex w-full max-w-sm flex-col gap-2 text-gray-500">
        {isAuthenticated && (
          <div className="flex justify-center">
            <Button variant="link" onClick={clearAuth}>
              Logout
            </Button>
          </div>
        )}
        <div className="grid grid-cols-3 text-sm">
          <div className="truncate overflow-hidden text-end">UI: {appVersion}</div>
          <a
            href="https://github.com/Silvenga/rustypaste-ui"
            rel="external nofollow noopener noreferrer"
            target="_blank"
            aria-label="Github Repository"
            className="flex justify-center hover:text-gray-700"
          >
            <FaGithub className="size-5" />
          </a>
          <div className="truncate overflow-hidden">Server: {serverVersion}</div>
        </div>
      </footer>
    </div>
  );
}
