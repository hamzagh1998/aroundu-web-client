import { Navigate } from "react-router";

import { useUserStore } from "@/hooks/store/use-user-store";

import { MAIN_PATHES } from "@/routes/main.routes";

import { PagesSwiper } from "./components/pages-swiper";
import { SplashScreen } from "@/components/splash-screen";

export function OnboardingPage() {
  const { userData } = useUserStore();

  if (!userData) {
    return <SplashScreen />;
  }

  if (userData?.isOnboarded) {
    return <Navigate to={"/" + MAIN_PATHES.MAIN} />;
  }

  return <PagesSwiper />;
}
