import logo from "./assets/rustypaste-logo.webp";
import { AuthGuard } from "@/components/AuthGuard.tsx";
import { Main } from "@/components/Main.tsx";
import { FaGithub } from "react-icons/fa";

export function App() {
  return (

    <div className="container mx-auto w-full h-screen p-4 flex flex-col items-center gap-4">
      <section className="flex justify-center mt-8">
        <img src={logo} alt="Rustypaste Logo" className="w-auto h-24" />
      </section>
      <AuthGuard>
        <Main />
      </AuthGuard>
      <footer className="mt-auto text-gray-500">
        <a href="" rel="external" aria-label="Github Repository" className="hover:text-gray-700">
          <FaGithub />
        </a>
      </footer>
    </div>
  );
}
