import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UpdateAvailableProvider } from "@/providers/UpdateAvailableProvider.tsx";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UpdateAvailableProvider>
      <App />
    </UpdateAvailableProvider>
  </StrictMode>,
);
