import { Navigate } from "react-router-dom";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

import { useUserStore } from "@/hooks/store/use-user-store";

import { AUTH_PATHES } from "@/routes/auth.routes";

import { SplashScreen } from "./splash-screen";
import { OnboardingPage } from "@/pages/onboarding/onboarding";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export function PrivateRouteWrapper({ children }: PrivateRouteProps) {
  const isAuthenticated = useIsAuthenticated();

  const { userData } = useUserStore();

  if (isAuthenticated === null || (isAuthenticated && !userData)) {
    return <SplashScreen />;
  }

  return isAuthenticated ? (
    userData?.isOnboarded ? (
      children
    ) : (
      <OnboardingPage />
    )
  ) : (
    <Navigate to={"/" + AUTH_PATHES.SIGNIN} />
  );
}
