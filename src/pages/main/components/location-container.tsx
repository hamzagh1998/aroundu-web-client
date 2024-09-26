import { useContext, useState } from "react";
import { FiLoader } from "react-icons/fi";

import { useUpdateProfile } from "@/services/profile/queries";

import { useUserStore } from "@/hooks/store/use-user-store";

import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/google-map";
import { ErrorAlert } from "@/components/error-alert";

export function LocationContainer({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { userData, setUserData } = useUserStore();

  const { locationCoordinates, address } = useContext(GoogleMap.Context);

  const [error, setError] = useState<string | null>(null);

  const updateProfile = useUpdateProfile();

  const onConfirmLocation = async () => {
    try {
      const newLocation = await updateProfile.mutateAsync({
        location: {
          address,
          latitude: locationCoordinates!.lat,
          longitude: locationCoordinates!.lng,
        },
        isOnboarded: true,
      });

      if (newLocation.data) {
        setUserData({
          ...userData!,
          location: newLocation.data.location,
          isOnboarded: true,
        });
        setOpen(false);
      } else {
        setError("Failed to save your location, please try again!");
      }
    } catch (error) {
      console.error(error);
      setError(
        "Failed to save your location, check your internet connection and try again!"
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      {error && <ErrorAlert title="Unexpected error" description={error} />}

      <GoogleMap className="w-full space-y-4">
        <div className="w-full flex justify-center items-center gap-2">
          <GoogleMap.LocationInput />
          <GoogleMap.LocateButton />
        </div>
        <GoogleMap.Map />
        {locationCoordinates && address && (
          <Button
            size="lg"
            className="flex justify-center items-center gap-2 float-end max-sm:w-full"
            disabled={updateProfile.isPending}
            onClick={onConfirmLocation}
          >
            {updateProfile.isPending && (
              <div className="w-fit animate-spin">
                <FiLoader size={20} />
              </div>
            )}
            Save Changes
          </Button>
        )}
      </GoogleMap>
    </div>
  );
}
