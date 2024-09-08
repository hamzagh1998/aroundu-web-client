import { createContext } from "react";

export const GoogleMapContext = createContext<{
  address: string;
  setAddress: (name: string) => void;
  locationCoordinates: { lat: number; lng: number } | null;
  setLocationCoordinates: (coords: { lat: number; lng: number }) => void;
}>({
  address: "",
  setAddress: () => {},
  locationCoordinates: null,
  setLocationCoordinates: () => {},
});
