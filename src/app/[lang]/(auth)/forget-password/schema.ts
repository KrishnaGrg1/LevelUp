import z from "zod";

const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "error.auth.emailRequired" })
    .email({ message: "error.auth.emailInvalid" }),
});

export default ForgetPasswordSchema;
