import { z, object } from "zod";

export const passwordSchema = z.coerce
  .string({ required_error: "Password is required" })
  .min(6, "Password must be more than 6 characters")
  .max(16, "Password must be less than 16 characters");

export const emailSchema = z.coerce
  .string({ required_error: "Email is required" })
  .min(1, "Email is required")
  .email("Invalid email")
  .endsWith("@gmail.com", "Only gmail is allowed");

export const nameSchema = z.coerce
  .string({ required_error: "Name is required" })
  .min(3, "Name must be more than 3 characters")
  .max(15, "Name must be less than 15 characters");

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const forgetPasswordSchema = object({
  email: emailSchema,
  password: passwordSchema,
});
