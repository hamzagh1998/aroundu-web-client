import { create } from "zustand";

export type UserDataType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
  storageUsageInMb: number;
  plan: "free" | "premium";
  location: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  isOnboarded: boolean;
  connections: string[];
  groups: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date | null;
};

type UserState = {
  userData?: UserDataType;
  setUserData: (data: UserDataType) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userData: undefined,
  setUserData: (data) => set(() => ({ userData: data })),
}));
