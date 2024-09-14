import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "@/lib/firebase/firebase.config";
import { useUserStore } from "@/hooks/store/use-user-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileType, profileSchema } from "@/schemas/profile";

export function ProfileForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { userData } = useUserStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
    },
  });

  const [signInProvider, setSignInProvider] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await auth.currentUser?.getIdTokenResult();
      setSignInProvider(res?.signInProvider!);
    })();
  }, []);

  const onSubmit = async (payload: ProfileType) => {
    console.log("Form data:", payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <div className="w-full">
            <Label htmlFor="photo">Profile Image</Label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              {...register("photo")}
            />
            {errors.photo && (
              <p className="text-destructive text-sm">{errors.photo.message}</p>
            )}
          </div>
          <div className="w-full grid grid-cols-2 gap-4 py-4">
            <div className="w-full">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Separator */}
          <Separator orientation="horizontal" className="flex-1 my-6" />

          {signInProvider === "password" && (
            <div className="w-full space-y-4">
              <div className="w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Label htmlFor="password">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="******"
                  {...register("oldPassword")}
                />
                {errors.oldPassword && (
                  <p className="text-destructive text-sm">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>
              <div className="w-full grid grid-cols-2 gap-4 py-4">
                <div className="w-full">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="******"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="text-destructive text-sm">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="******"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
