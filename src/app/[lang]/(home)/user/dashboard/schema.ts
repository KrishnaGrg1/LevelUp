import z from 'zod';

export const onboardingSchema = z.object({
  categoriesNames: z.array(z.string()).min(1, { message: 'error.onboarding.categoriesRequired' }),

  goal: z.string().optional(),

  experience: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
    message: 'error.onboarding.experienceRequired',
  }),

  heardAboutUs: z.enum(['facebook', 'website', 'friend', 'other'], {
    message: 'error.onboarding.heardAboutUsRequired',
  }),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
