import { warn } from "console";
import z from "zod";

const VerifySchema = z.object({
  otp_code: z
    .string()
    .min(6, { message: "OTP must be at least 6 digits long" }),
  email: z.string().min(6, { message: "OTP must be at least 6 digits long" }),
});

export default VerifySchema;
