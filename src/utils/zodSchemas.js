import { z } from "zod";

// Login form schema
export const loginSchema = z.object({
  userormail: z.string().min(1, { message: "Username/Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Registration form schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "No spaces or symbols allowed",
      })
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
