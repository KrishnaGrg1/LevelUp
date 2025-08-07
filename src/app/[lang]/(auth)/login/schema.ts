import z from "zod";

const loginSchema = z.object({
  email: z.email().min(3, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export default loginSchema;

