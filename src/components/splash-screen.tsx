import useCurrentTheme from "@/hooks/use-current-theme";

export function SplashScreen() {
  const currentTheme = useCurrentTheme();

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col space-y-6">
      <div className="w-full h-fit flex justify-center items-center gap-2">
        <img
          src={currentTheme === "light" ? "icon-light.svg" : "icon-dark.svg"}
          alt="logo"
          className="w-16 h-16"
        />
        <p className="text-4xl font-bold">AroundU</p>
      </div>
      <div className="h-1.5 w-1/2 lg:w-1/6 bg-primary-foreground overflow-hidden rounded-full">
        <div className="progress w-full h-full bg-primary left-right"></div>
      </div>
    </div>
  );
}
