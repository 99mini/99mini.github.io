import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/hooks/theme/theme-provider";

import "@/styles/global.css";

function RootLayout() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
