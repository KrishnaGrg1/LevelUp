import z from "zod";

const ResetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email" }),
    otp_code: z
      .string()
      .length(6, { message: "OTP must be exactly 6 digits long" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default ResetPasswordSchema;
