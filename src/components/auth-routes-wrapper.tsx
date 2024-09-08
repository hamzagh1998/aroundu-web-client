import { Navigate } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { useUserStore } from "@/hooks/store/use-user-store";

import { MAIN_PATHES } from "@/routes/main.routes";

import { SplashScreen } from "./splash-screen";

interface AuthRouteProps {
  children: React.ReactNode;
}

export function AuthRouteWrapper({ children }: AuthRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  const { userData } = useUserStore();

  if (isAuthenticated === null || (isAuthenticated && !userData)) {
    return <SplashScreen />;
  }

  return isAuthenticated ? (
    <Navigate
      to={
        "/" +
        (userData?.isOnboarded ? MAIN_PATHES.MAIN : MAIN_PATHES.ONBOARDING)
      }
    />
  ) : (
    children
  );
}
