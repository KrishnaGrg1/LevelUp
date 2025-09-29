import z from 'zod';

const VerifySchema = z.object({
  otp: z
    .string()
    .min(1, { message: 'error.auth.otpRequired' })
    .length(6, { message: 'error.auth.otpLength' }),
  userId: z.string().min(1, { message: 'error.auth.userIdRequired' }),
});

export default VerifySchema;
