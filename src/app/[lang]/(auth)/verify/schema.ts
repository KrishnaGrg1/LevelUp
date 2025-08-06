import { warn } from "console";
import z from "zod";

const VerifySchema = z.object({
  otp: z.number().min(6, { message: "OTP must be at least 6 digits long" }),
});

export default VerifySchema;
