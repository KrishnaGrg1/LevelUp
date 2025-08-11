import z from "zod";

const ForgetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default ForgetPasswordSchema;
