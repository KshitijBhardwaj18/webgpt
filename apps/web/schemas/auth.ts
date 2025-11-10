import * as z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Are you sure thats your name"),
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Enter a strong password"),
});

export const signInSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string(),
});
