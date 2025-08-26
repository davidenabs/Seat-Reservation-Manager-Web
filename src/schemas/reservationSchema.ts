import { z } from "zod";

export const ReservationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"]),
  ageRange: z.enum(["18-25", "26-35", "36-45", "46-55", "55+"]),
  aboutYourself: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type ReservationFormData = z.infer<typeof ReservationFormSchema>;