import z from 'zod';

const ResetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'error.auth.emailRequired' })
      .email({ message: 'error.auth.emailInvalid' }),
    otp_code: z
      .string()
      .min(1, { message: 'error.auth.otpRequired' })
      .length(6, { message: 'error.auth.otpLength' }),
    newPassword: z
      .string()
      .min(1, { message: 'error.auth.passwordRequired' })
      .min(6, { message: 'error.auth.passwordMinLength' }),
    confirmPassword: z.string().min(1, { message: 'error.auth.confirmPasswordRequired' }),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'error.auth.passwordMismatch',
  });

export default ResetPasswordSchema;
