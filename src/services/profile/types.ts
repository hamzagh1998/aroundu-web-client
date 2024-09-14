export type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  photoURL?: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  isOnboarded?: boolean;
};
