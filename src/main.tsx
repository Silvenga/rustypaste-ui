import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { UpdateAvailableProvider } from "@/providers/UpdateAvailableProvider.tsx";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <UpdateAvailableProvider>
        <App />
      </UpdateAvailableProvider>
    </TooltipProvider>
  </StrictMode>,
);
