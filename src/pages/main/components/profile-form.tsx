import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdClose } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

import { auth } from "@/lib/firebase/firebase.config";
import { capitalizer, cn } from "@/lib/utils";

import { useUserStore } from "@/hooks/store/use-user-store";
import { useFirebaseUploadFile } from "@/hooks/use-firebase-upload-file";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  ProfileType,
  profileSchema,
} from "@/schemas/profile";

import { useUpdateProfile } from "@/services/profile/queries";

import { getAuth } from "firebase/auth";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { ErrorAlert } from "@/components/error-alert";
import { CustomTooltip } from "@/components/custom-tooltip";
import { reauthenticateUser } from "@/lib/firebase/auth/change-credentials";

export function ProfileForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const {
    mutateAsync,
    error: updateProfileError,
    isPending: isUpdateProfilePending,
  } = useUpdateProfile();

  const { userData, setUserData } = useUserStore();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: capitalizer(userData?.firstName!)?.trim(),
      lastName: capitalizer(userData?.lastName!)?.trim(),
      email: userData?.email!,
    },
  });

  const { error, isPending, onAddFile } = useFirebaseUploadFile();
  const {
    error: UpdateCredError,
    isPending: isCredUpdating,
    onFirebaseUpdateCredentials,
  } = useFirebaseAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [signInProvider, setSignInProvider] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await auth.currentUser?.getIdTokenResult();
      setSignInProvider(res?.signInProvider!);
    })();
  }, []);

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    oldPassword,
    newPassword,
    photo,
    location,
  }: ProfileType) => {
    // Check user pwd
    if (
      email !== userData?.email ||
      oldPassword?.length ||
      newPassword?.length
    ) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        return;
      }
      const res = await reauthenticateUser(
        user,
        userData?.email!,
        oldPassword || ""
      );
      if (res.error) {
        return setError("oldPassword", { message: "Invalid password" });
      }
    }
    let photoURL = userData?.photoURL;
    if (photo) {
      const file = photo as File;
      const res = await onAddFile(
        file,
        MAX_FILE_SIZE,
        email ? email : userData?.email! + "/photo",
        "update"
      );

      if (typeof res === "object") {
        photoURL = res.url;
      }
    }

    const { data } = await mutateAsync({
      firstName,
      lastName,
      email,
      location: location || userData?.location!,
      photoURL,
    });

    setUserData({ ...userData!, ...data });

    if (email !== userData?.email) {
      await onFirebaseUpdateCredentials(oldPassword!, email!, "email");
    }

    if (oldPassword?.length && newPassword?.length) {
      await onFirebaseUpdateCredentials(oldPassword!, newPassword, "password");
    }
    onClose();
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) return setSelectedImage(null);
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

  const onClose = () => {
    setValue("firstName", userData?.firstName!);
    setValue("lastName", userData?.lastName!);
    setValue("email", userData?.email!);
    setValue("oldPassword", "");
    setValue("newPassword", "");
    setValue("confirmPassword", "");
    setOpen(false);
  };

  const isLoading = useMemo(
    () => isPending || isCredUpdating || isUpdateProfilePending,
    [isPending, isCredUpdating, isUpdateProfilePending]
  );

  return (
    <form className="w-full h-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {(error || UpdateCredError || updateProfileError) && (
        <ErrorAlert
          title="Failed to update profile"
          description={
            error || UpdateCredError || "User with this email already exists"
          }
        />
      )}

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
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={(e) => {
                  const files = e.target.files!;
                  if (files.length > 0) {
                    const file = files[0];
                    // Validate the file type and size
                    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                      // Set error message for invalid file type
                      setError("photo", {
                        message:
                          "Only .jpg, .png, and .svg formats are supported",
                      });
                      return;
                    }
                    if (file.size > MAX_FILE_SIZE) {
                      // Set error message for exceeding file size
                      setError("photo", {
                        message: "Max file size is 8MB",
                      });
                      return;
                    }
                    // If valid, update the form state
                    field.onChange(file);
                    handleFileChange(file);
                  } else {
                    // Clear the field if no file is selected
                    field.onChange(undefined);
                    handleFileChange(undefined);
                  }
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
                    .png, .jpeg, .svg files up to 8MB.
                  </p>
                </div>
              </div>
              {error && <p className="text-destructive text-xs">{error}</p>}
            </div>
          )}
        />
        {errors.photo && (
          <p className="text-destructive text-xs">{errors.photo.message}</p>
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
            <Label
              htmlFor="password"
              className="flex justify-start items-center gap-1"
            >
              Current Password&ensp;
              <CustomTooltip text="Enter your current password to update email/password">
                <div className="cursor-pointer">
                  <FaInfoCircle />
                </div>
              </CustomTooltip>
            </Label>
            <Input
              id="password"
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
          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
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
      <div className="mt-6">
        <Button
          size="lg"
          className="flex justify-center items-center gap-2 float-end max-sm:w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <div>
              <FiLoader className="animate-spin" size={22} />
            </div>
          )}
          Save changes
        </Button>
      </div>
    </form>
  );
}
