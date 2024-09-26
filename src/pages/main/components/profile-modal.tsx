import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import { ProfileForm } from "./profile-form";

import { cn } from "@/lib/utils";

export function ProfileModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [currentTabbar, setCurrentTabbar] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="lg:flex justify-between items-start gap-2 lg:min-w-[950px] max-md:h-full max-md:w-full overflow-auto">
        <div className="lg:w-3/12 lg:border-r-2 max-lg:flex justify-between items-center gap-2 max-lg:space-x-2 space-y-2 lg:border-r-border border-b-border lg:h-full lg:pr-2 pb-2">
          <p
            className={cn(
              "w-full p-2 cursor-pointer rounded-lg",
              currentTabbar === "profile" && "bg-primary"
            )}
            onClick={() => setCurrentTabbar("profile")}
          >
            My Profile
          </p>
          <p
            className={cn(
              "w-full p-2 cursor-pointer rounded-lg",
              currentTabbar === "location" && "bg-primary"
            )}
            onClick={() => setCurrentTabbar("location")}
          >
            Location
          </p>
          <p
            className={cn(
              "w-full p-2 cursor-pointer rounded-lg",
              currentTabbar === "subscription" && "bg-primary"
            )}
            onClick={() => setCurrentTabbar("subscription")}
          >
            Subscription
          </p>
        </div>
        <div className="w-full space-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>Edit your profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Separator orientation="horizontal" className="flex-1" />
          {currentTabbar === "profile" && (
            <ProfileForm
              setOpen={setOpen}
              setCurrentTabbar={setCurrentTabbar}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
