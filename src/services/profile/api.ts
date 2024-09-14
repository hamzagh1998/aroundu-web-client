import { axiosInstance } from "../axios-instance";

import { PROFILE_API_ENDPOINT } from "./api-endpoints";

import { ProfilePayload } from "./types";

export function updateProfile(payload: ProfilePayload) {
  return axiosInstance.patch(PROFILE_API_ENDPOINT, payload);
}
