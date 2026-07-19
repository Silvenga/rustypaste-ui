import { AuthGuard } from "@/components/AuthGuard.tsx";
import { Footer } from "@/components/footer/Footer.tsx";
import { Sections } from "@/components/Sections.tsx";
import logo from "./assets/rustypaste-logo.webp";

export function App() {
  return (
    <div className="container mx-auto flex h-screen w-full flex-col items-center gap-4 p-4 select-none">
      <section className="mt-8 flex justify-center">
        <img src={logo} alt="Rustypaste Logo" className="h-16 w-auto" />
      </section>
      <AuthGuard>
        <Sections />
      </AuthGuard>
      <Footer />
    </div>
  );
}
