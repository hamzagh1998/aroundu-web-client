import { z } from "zod";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const profileSchema = z
  .object({
    firstName: z.string().min(1, "Enter a valid First name").optional(),
    lastName: z.string().min(1, "Enter a valid Last name").optional(),
    email: z.string().min(5, "Invalid email address").optional(),
    oldPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    photo: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 8MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .png, and .webp formats are supported"
      )
      .optional(),
    location: z
      .object({
        address: z.string().min(6, "Address is required"),
        latitude: z
          .number()
          .min(-90, "Latitude must be between -90 and 90")
          .max(90, "Latitude must be between -90 and 90"),
        longitude: z
          .number()
          .min(-180, "Longitude must be between -180 and 180")
          .max(180, "Longitude must be between -180 and 180"),
      })
      .optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"], // Error message will be on confirmPassword field
    message: "Passwords must match",
  });

export type ProfileType = z.infer<typeof profileSchema>;
