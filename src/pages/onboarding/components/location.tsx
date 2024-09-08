import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/google-map";

export function Location() {
  const [showGoogleMap, setShowGoogleMap] = useState(false);

  const { locationCoordinates, address } = useContext(GoogleMap.Context);

  return (
    <div className="w-full h-1/2 space-y-6">
      {showGoogleMap ? (
        <GoogleMap className="w-full space-y-4">
          <div className="w-full flex justify-center items-center gap-2">
            <GoogleMap.LocationInput />
            <GoogleMap.LocateButton />
          </div>
          <GoogleMap.Map />
          {locationCoordinates && address && (
            <Button size="lg" className="font-bold">
              Confirm Location
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
