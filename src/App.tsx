import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./providers/theme-provider";

import { useIsAuthenticated } from "./hooks/use-is-authenticated";

import { useUserStore } from "./hooks/store/use-user-store";

import { useUserData } from "./services/auth/queries";

import { router } from "./routes";

import { Toaster } from "./components/ui/toaster";
import { SplashScreen } from "./components/splash-screen";

export function App() {
  const { setUserData } = useUserStore();

  const isAuthenticated = useIsAuthenticated();

  const { data, error } = useUserData(!!isAuthenticated);

  if (error) {
    // TODO: Handle error
  }

  useEffect(() => {
    if (!data) return;
    setUserData({ ...data });
  }, [data]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
