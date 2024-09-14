import { useMutation } from "@tanstack/react-query";

import { ProfilePayload } from "./types";

import { updateProfile } from "./api";

export function useUpdateProfile() {
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (payload: ProfilePayload) => updateProfile(payload),
  });
}
