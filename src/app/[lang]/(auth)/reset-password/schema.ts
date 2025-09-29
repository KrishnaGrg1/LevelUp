import { z } from 'zod';

const ResetPasswordSchema = z
  .object({
    userId: z.string().min(1, { message: 'error.auth.userIdRequired' }),
    otp: z
      .string()
      .min(1, { message: 'error.auth.otpRequired' })
      .length(6, { message: 'error.auth.otpLength' }),
    newPassword: z
      .string()
      .min(8, { message: 'error.auth.passwordMinLength' })
      .max(50, { message: 'error.auth.passwordMaxLength' }),
    confirmPassword: z.string().min(1, { message: 'error.auth.confirmPasswordRequired' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'error.auth.passwordMismatch',
  });

export default ResetPasswordSchema;
