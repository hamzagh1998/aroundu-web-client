import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdClose } from "react-icons/io";

import { auth } from "@/lib/firebase/firebase.config";
import { cn } from "@/lib/utils";

import { useUserStore } from "@/hooks/store/use-user-store";
import { useFirebaseUploadFile } from "@/hooks/use-firebase-upload-file";

import { ProfileType, profileSchema } from "@/schemas/profile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    control,
    formState: { errors },
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
    },
  });

  const { error, isPending, onAddFile } = useFirebaseUploadFile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signInProvider, setSignInProvider] = useState<string | null>(null);
  const [currentTabbar, setCurrentTabbar] = useState("profile");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await auth.currentUser?.getIdTokenResult();
      setSignInProvider(res?.signInProvider!);
    })();
  }, []);

  const onSubmit = async (payload: ProfileType) => {
    console.log("Form data:", payload);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | undefined
  ) => {
    if (!e) return setSelectedImage(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="lg:min-w-[950px] max-md:h-full max-md:w-full overflow-auto">
        <DialogHeader className="text-left">
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Separator orientation="horizontal" className="flex-1" />
        <form
          className="w-full lg:flex justify-between items-start gap-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="lg:w-3/12 lg:border-r-2 max-lg:flex justify-between items-center gap-2 max-lg:space-x-2 space-y-2 border-b-2 lg:border-r-border border-b-border lg:h-full lg:pr-2 pb-2">
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
                currentTabbar === "subscription" && "bg-primary"
              )}
              onClick={() => setCurrentTabbar("subscription")}
            >
              Subscription
            </p>
          </div>
          <div className="lg:w-9/12">
            {/* Image Upload */}
            <div>
              <Label htmlFor="photo" className="text-lg">
                Your Photo
              </Label>
              <Controller
                name="photo"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      type="file"
                      id="company-logo"
                      className="hidden"
                      ref={fileInputRef}
                      accept=".png,.jpeg,.jpg,.svg"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleFileChange(e);
                      }}
                    />
                    <div className="mt-4 flex justify-start items-start gap-4">
                      {selectedImage ? (
                        <div className="relative flex justify-center items-center w-fit h-fit bg-muted-foreground rounded-full cursor-pointer">
                          <img
                            src={selectedImage}
                            alt="Selected Logo"
                            className="w-full sm:w-28 h-28 rounded-full"
                          />
                          <div
                            className="cursor-pointer text-lg absolute top-0 right-0 text-red-500"
                            onClick={() => {
                              field.onChange(undefined);
                              handleFileChange(undefined);
                            }}
                          >
                            <IoMdClose />
                          </div>
                        </div>
                      ) : (
                        <div onClick={handleButtonClick}>
                          <img
                            src={userData?.photoURL}
                            className="text-muted w-28 h-28"
                          />
                        </div>
                      )}
                      <div className="flex justify-center items-start gap-4 flex-col">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl"
                          onClick={handleButtonClick}
                          size="lg"
                        >
                          Upload image
                        </Button>
                        <p className="text-muted-foreground text-sm">
                          .png, .jpeg, .svg files up to 8MB, Recommended size is
                          256x256px
                        </p>
                      </div>
                    </div>
                    {error && (
                      <p className="text-destructive text-xs">{error}</p>
                    )}
                  </div>
                )}
              />
              {errors.photo && (
                <p className="text-destructive text-xs">
                  {errors.photo.message}
                </p>
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
