import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalStyle } from "@styles/global-style"; // ✅
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <App />
  </StrictMode>
);
