import * as v from "valibot";

export const registerSchema = v.pipe(
  v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty("Email is required"),
      v.email("Please enter a valid email address")
    ),

    username: v.pipe(
      v.string(),
      v.nonEmpty("Username is required"),
      v.minLength(3, "Username must be at least 3 characters"),
      v.maxLength(20, "Username cannot exceed 20 characters"),
      v.regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
    ),

    password: v.pipe(
      v.string(),
      v.nonEmpty("Password is required"),
      v.minLength(8, "Password must be at least 8 characters")
    ),

    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match."
    ),
    ["confirmPassword"]
  )
);

export const loginSchema = v.object({
  userormail: v.pipe(
    v.string(),
    v.nonEmpty("Username or email is required"),
    v.minLength(1, "Please enter your username or email")
  ),

  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required"),
    v.minLength(4, "Password must be at least 4 characters")
  ),
});

export const forgotPasswordSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Username or email is required"),
    v.email("Please enter a valid your email address")
  ),
});

export const resetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string(),
      v.nonEmpty("Password is required"),
      v.minLength(8, "Password must be at least 8 characters")
    ),

    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match."
    ),
    ["confirmPassword"]
  )
);

export const profileUpdateSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty("Name is required")),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email is required"),
    v.email("Please enter a valid email address")
  ),
  phoneNumber: v.optional(v.string()),
  address: v.optional(v.string()),
});

export const changePasswordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(
      v.string(),
      v.nonEmpty("Current password is required")
    ),
    newPassword: v.pipe(
      v.string(),
      v.nonEmpty("New password is required"),
      v.minLength(8, "Password must be at least 8 characters")
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty("Please confirm your password")
    ),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (input) => input.newPassword === input.confirmPassword,
      "Passwords do not match."
    ),
    ["confirmPassword"]
  )
);
