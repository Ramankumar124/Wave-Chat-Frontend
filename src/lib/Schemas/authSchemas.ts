import { z } from "zod";


// Schema for Step 1 (Only email and password)
export const register1FormSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // name: z.string().min(2, "Name must be at least 2 characters"),
    // bio: z.string().min(5, "Bio must be at least 5 characters long"),
    // avatar: z.any().optional(),
  })

export const register2FormSchema =z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().min(5, "Bio must be at least 5 characters long"),
    avatar: z
      .any()  
      .refine((file) => file?.length > 0, "File is required")
      .refine(
        (files) => files?.[0] && files[0].size < 2 * 1024 * 1024,
        "File size must be less than 2MB"
      )
      .refine(
        (files) => files?.[0] && ["image/png", "image/jpeg"].includes(files[0].type),
        "Only PNG and JPEG files are allowed"
      )
})
// export const registerFormSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z
//       .string({ required_error: "Email is required" })
//       .email("Invalid email address"),
//     bio: z.string().min(5, "Bio must be at least 5 characters long"),
//     avatar: z
//       .any()
//       .refine((file) => file?.length > 0, "File is required")
//       .refine(
//         (files) => files?.[0] && files[0].size < 2 * 1024 * 1024,
//         "File size must be less than 2MB"
//       )
//       .refine(
//         (files) => files?.[0] && ["image/png", "image/jpeg"].includes(files[0].type),
//         "Only PNG and JPEG files are allowed"
//       ),
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters"),
//   //   confirmPassword: z
//   //     .string()
//   //     .min(1, "Confirm Password is required"),
//   // })
//   // .refine((data) => data.password === data.confirmPassword, {
//   //   message: "Passwords do not match",
//   //   path: ["confirmPassword"], // Error will be shown on confirmPassword field
//   });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "password required" })
    .email({ message: "Invalid email" }),

  password: z
    .string({ required_error: "password required" })
    .min(8, { message: "password must be 8 characters" }),
});
export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "password required" })
    .email({ message: "Invalid email" }),
});
export const otpSchema = z.object({
  otp: z
    .string({ required_error: "Otp is required" })
    .min(6, { message: "Enter your 6 digit otp " }),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
// export type Step1Inputs = z.infer<typeof step1Schema>;
// export type Step2Inputs = z.infer<typeof step2Schema>;

// // Final Type for Full Form
// export type RegisterInputs = Step1Inputs & Step2Inputs;


export type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;

export type OtpInput = z.infer<typeof otpSchema>;
