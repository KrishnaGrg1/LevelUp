import z from 'zod';

export const editUserSchema = z.object({
  UserName: z.string().min(1, 'error.user.nameRequired').optional(),
  email: z
    .string()
    .min(1, 'error.user.emailRequired')
    .email({ message: 'error.user.emailInvalid' })
    .optional(),
  level: z
    .number()
    .min(1, 'error.user.levelRequired')
    .max(10, 'error.user.levelMaxValue')
    .optional(),
  isVerified: z.boolean().optional(),
  xp: z.number().min(0, { message: 'XP cannot be negative' }).optional(),
});

export type editUserFormData = z.infer<typeof editUserSchema>;
