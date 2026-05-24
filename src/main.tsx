import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

if (rootEl.innerHTML) {
  // SSG: hydrate pre-rendered HTML
  createRoot(rootEl).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
} else {
  // CSR: fresh render
  createRoot(rootEl).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
}
