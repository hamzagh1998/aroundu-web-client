import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdClose } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

import { auth } from "@/lib/firebase/firebase.config";
import { capitalizer, cn } from "@/lib/utils";

import { UserDataType, useUserStore } from "@/hooks/store/use-user-store";
import { useFirebaseUploadFile } from "@/hooks/use-firebase-upload-file";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  ProfileType,
  profileSchema,
} from "@/schemas/profile";

import { useUpdateProfile } from "@/services/profile/queries";

import { getAuth } from "firebase/auth";

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
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { ErrorAlert } from "@/components/error-alert";
import { CustomTooltip } from "@/components/custom-tooltip";
import { reauthenticateUser } from "@/lib/firebase/auth/change-credentials";

export function ProfileForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
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
  const [currentTabbar, setCurrentTabbar] = useState("profile");
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
    <Dialog open={open} onOpenChange={onClose}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
