import z from 'zod';

const VerifySchema = z.object({
  otp_code: z
    .string()
    .min(1, { message: 'error.auth.otpRequired' })
    .length(6, { message: 'error.auth.otpLength' }),
  email: z
    .string()
    .min(1, { message: 'error.auth.emailRequired' })
    .email({ message: 'error.auth.emailInvalid' }),
});

export default VerifySchema;
