import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCompass } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { FiHardDrive } from "react-icons/fi";
import { MdEvent, MdGroupWork } from "react-icons/md";

import useCurrentTheme from "@/hooks/use-current-theme";

import { useUserStore } from "@/hooks/store/use-user-store";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase/firebase.config";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ProfileForm } from "./components/profile-form";

import { capitalizer } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const currentTheme = useCurrentTheme();

  const { userData } = useUserStore();

  const [showProfileForm, setShowProfileForm] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="hidden lg:block w-[240px] border-r bg-muted/40">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex h-[60px] items-center px-6">
            <div className="flex items-center gap-2 font-semibold">
              <img
                src={
                  currentTheme === "light" ? "icon-light.svg" : "icon-dark.svg"
                }
                alt="logo"
                className="w-8 h-8"
              />
              <span>AroundU</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                to="#"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-lg font-bold text-primary cursor-pointer"
              >
                <MdEvent size={26} />
                Public Events
              </Link>
              <Link
                to="#"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-lg text-muted-foreground transition-all hover:text-primary cursor-pointer"
              >
                <FaCompass size={26} />
                Explore
              </Link>
              <Link
                to="#"
                className="flex items-center gap-3 rounded-lg px-3 py-4 text-lg text-muted-foreground transition-all hover:text-primary cursor-pointer"
              >
                <MdGroupWork size={26} />
                Connections
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6 fixed left-auto right-0 w-full lg:w-[calc(100%-15rem)]">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => console.log("hello")}
                className="lg:hidden"
              >
                <TiThMenu size={26} />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex h-[60px] items-center px-6">
                  <div className="flex items-center gap-2 font-semibold">
                    <img
                      src={
                        currentTheme === "light"
                          ? "icon-light.svg"
                          : "icon-dark.svg"
                      }
                      alt="logo"
                      className="w-8 h-8"
                    />
                    <span className="">AroundU</span>
                  </div>
                </div>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-bold text-primary"
                >
                  <MdEvent size={26} />
                  Public Events
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <FaCompass size={26} />
                  Explore
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg text-muted-foreground transition-all hover:text-primary"
                >
                  <MdGroupWork size={26} />
                  Connections
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Public Events</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src={userData?.photoURL}
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt={userData?.firstName + " " + userData?.lastName}
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}
                />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex justify-start items-center gap-3 text-lg font-bold">
                <img
                  src={userData?.photoURL}
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt={userData?.firstName + " " + userData?.lastName}
                  style={{ aspectRatio: "32/32", objectFit: "cover" }}
                />
                {capitalizer(userData?.firstName + " " + userData?.lastName)}
                <Badge className="text-xs">{userData?.plan}</Badge>
              </DropdownMenuLabel>
              {userData?.plan === "free" && (
                <DropdownMenuLabel className="flex justify-start items-end gap-1 text-xs">
                  <Progress value={(userData?.storageUsageInMb * 100) / 100} />
                  <span>{userData?.storageUsageInMb}/100MB</span>
                  <div>
                    <FiHardDrive size={18} />
                  </div>
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upgrade</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowProfileForm(true)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Feedback</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => auth.signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="cursor-pointer">
            <FaBell size={24} />
          </div>
          <ModeToggle />
        </header>

        {/* Main content area */}
        <div className="flex-1 mt-14 lg:mt-[60px] px-6">{children}</div>
        <ProfileForm open={showProfileForm} setOpen={setShowProfileForm} />
      </div>
    </div>
  );
}
