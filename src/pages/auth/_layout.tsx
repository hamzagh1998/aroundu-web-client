import useCurrentTheme from "@/hooks/use-current-theme";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const currentTheme = useCurrentTheme();

  return (
    <main className="w-full h-full flex justify-center items-center flex-col space-y-6">
      <div className="w-full flex justify-center items-center gap-3">
        <img
          src={currentTheme === "light" ? "icon-light.svg" : "icon-dark.svg"}
          alt="logo"
          className="w-16 h-16"
        />
        <p className="text-4xl font-bold">AroundU</p>
      </div>
      <div className="p-2 w-full md:w-2/3 xl:w-1/3">{children}</div>
    </main>
  );
}
