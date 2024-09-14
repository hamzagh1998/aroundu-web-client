import { useContext, useState } from "react";
import { FiLoader } from "react-icons/fi";

import { useUpdateProfile } from "@/services/profile/queries";

import { useUserStore } from "@/hooks/store/use-user-store";

import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/google-map";
import { ErrorAlert } from "@/components/error-alert";

export function Location() {
  const updateProfile = useUpdateProfile();

  const { userData, setUserData } = useUserStore();

  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { locationCoordinates, address } = useContext(GoogleMap.Context);

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
      } else {
        setError("Failed to save your location, please try again!");
      }
    } catch (error) {
      console.error(error);
      setError(
        "Failed to save your location, check your internet connection and try again!"
      );
    } finally {
    }
  };

  return (
    <div className="w-full h-1/2 space-y-6">
      {error && <ErrorAlert title="Unexpected error" description={error} />}
      {showGoogleMap ? (
        <GoogleMap className="w-full space-y-4">
          <div className="w-full flex justify-center items-center gap-2">
            <GoogleMap.LocationInput />
            <GoogleMap.LocateButton />
          </div>
          <GoogleMap.Map />
          {locationCoordinates && address && (
            <Button
              size="lg"
              className="flex justify-between items-center gap-2 font-bold"
              disabled={updateProfile.isPending}
              onClick={onConfirmLocation}
            >
              {updateProfile.isPending && (
                <div className="w-fit animate-spin">
                  <FiLoader size={20} />
                </div>
              )}
              Confirm My Location
            </Button>
          )}
        </GoogleMap>
      ) : (
        <>
          <img src="location.png" className="m-auto lg:h-[560px]" />
          <h1 className="text-2xl lg:text-4xl font-semibold">
            Your city, Your community
          </h1>
          <p className="text-lg text-muted-foreground">
            Grant location access to help us discover events happening around
            you. Communicate with people, join local communities in your city
            and share your presence at events
          </p>
          <Button size="lg" onClick={() => setShowGoogleMap(true)}>
            Discover now
          </Button>
        </>
      )}
    </div>
  );
}
