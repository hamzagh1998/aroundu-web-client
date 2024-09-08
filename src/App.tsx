import { Suspense, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./providers/theme-provider";

import { useIsAuthenticated } from "./hooks/use-is-authenticated";

import { useUserStore } from "./hooks/store/use-user-store";

import { useUserData } from "./services/auth/queries";

import { router } from "./routes";

import { Toaster } from "./components/ui/toaster";
import { SplashScreen } from "./components/splash-screen";
import { GoogleMapContext } from "./context/google-map-context";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export function App() {
  const { setUserData } = useUserStore();

  const isAuthenticated = useIsAuthenticated();

  const { data, error } = useUserData(!!isAuthenticated);

  const [address, setAddress] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
        <GoogleMapContext.Provider
          value={{
            address,
            setAddress,
            locationCoordinates,
            setLocationCoordinates,
          }}
        >
          <RouterProvider router={router} />
        </GoogleMapContext.Provider>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
