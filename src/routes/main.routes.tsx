import { MainPage } from "@/pages/main/main";
import { OnboardingPage } from "@/pages/onboarding/onboarding";
import { RouteObject } from "react-router";

export const MAIN_PATHES = {
  ONBOARDING: "onboarding",
  MAIN: "main",
};

export const mainRoutes: RouteObject[] = [
  //* onboarding page
  {
    path: MAIN_PATHES.ONBOARDING,
    element: <OnboardingPage />,
  },
  //* main pages
  {
    path: MAIN_PATHES.MAIN,
    element: <MainPage />,
  },
];
