// schemas/registerSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'error.auth.usernameRequired' })
    .min(3, { message: 'error.auth.usernameMinLength' }),
  email: z
    .string()
    .min(1, { message: 'error.auth.emailRequired' })
    .email({ message: 'error.auth.emailInvalid' }),
  password: z
    .string()
    .min(1, { message: 'error.auth.passwordRequired' })
    .min(6, { message: 'error.auth.passwordMinLength' }),
});
