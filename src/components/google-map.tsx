import { useContext, useRef, useEffect, Suspense } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { IoMdLocate } from "react-icons/io";

import { cn } from "@/lib/utils";

import { useGeolocation } from "@/hooks/use-geolocation";

import { GoogleMapContext } from "@/context/google-map-context";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function GoogleMap({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={cn("google-map-container", className)}>{children}</div>
  );
}

GoogleMap.Context = GoogleMapContext;

//* Components:
GoogleMap.LocationInput = () => {
  const { address, setAddress, setLocationCoordinates } = useContext(
    GoogleMap.Context
  );

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setLocationCoordinates(latLng);
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={setAddress}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="autocomplete-root w-full">
          <Input {...getInputProps({ placeholder: "Type address" })} />

          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              const style = suggestion.active
                ? {
                    backgroundColor: "#7c3aed",
                    cursor: "pointer",
                    color: "#000",
                  }
                : {
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    color: "#000",
                  };

              const { key, ...restProps } = getSuggestionItemProps(suggestion, {
                className,
                style,
              });

              return (
                <div key={key} {...restProps}>
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

GoogleMap.LocateButton = () => {
  const { setAddress, setLocationCoordinates } = useContext(GoogleMap.Context);
  const { location } = useGeolocation();

  const handleLocation = async () => {
    if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: location.latitude, lng: location.longitude } },
        async (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address;
            setAddress(address);
            setLocationCoordinates({
              lat: location.latitude,
              lng: location.longitude,
            });
          } else {
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    }
  };

  return (
    <Button
      className="flex justify-center items-center gap-2 h-11"
      variant={"outline"}
      size="lg"
      onClick={handleLocation}
    >
      <IoMdLocate size={24} />
      Your current location
    </Button>
  );
};

GoogleMap.Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { locationCoordinates, setAddress, setLocationCoordinates } =
    useContext(GoogleMap.Context);

  useEffect(() => {
    if (mapRef.current) {
      const initMap = async () => {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        const map = new Map(mapRef.current as HTMLElement, {
          zoom: 15,
          center: locationCoordinates
            ? {
                lat: locationCoordinates.lat,
                lng: locationCoordinates.lng,
              }
            : { lat: 0, lng: 0 }, // Default center if no coordinates
          mapId: "e2893848924cbac7",
        });

        if (locationCoordinates) {
          new AdvancedMarkerElement({
            map,
            position: {
              lat: locationCoordinates.lat,
              lng: locationCoordinates.lng,
            },
          });
        }

        map.addListener("click", async (event: any) => {
          const latLng = event.latLng.toJSON();
          const geocoder = new google.maps.Geocoder();

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setAddress(address);
              setLocationCoordinates(latLng);
            } else {
              console.error(
                "Geocode was not successful for the following reason: " + status
              );
            }
          });
        });
      };

      initMap().catch((e) => {
        console.error("Error initializing map", e);
      });
    }
  }, [locationCoordinates]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div ref={mapRef} className="w-full h-[600px]" />
    </Suspense>
  );
};
