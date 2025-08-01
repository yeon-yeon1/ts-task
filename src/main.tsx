import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalStyle } from "@styles/global-style";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </StrictMode>
);
