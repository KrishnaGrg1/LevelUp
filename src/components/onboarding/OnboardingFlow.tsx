'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { t } from '@/translations/index';
import { Language } from '@/stores/useLanguage';
import { onboardingSchema, OnboardingFormData } from '@/app/[lang]/(home)/user/dashboard/schema';
import { completeOnboarding } from '@/lib/services/auth';
import { getCategories } from '@/lib/services/communities';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '../ui/dialog';
import authStore from '@/stores/useAuth';

interface OnboardingFlowProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const EXPERIENCE_LEVELS = [
  { id: 'BEGINNER', icon: '🌱', description: 'Just starting out' },
  { id: 'INTERMEDIATE', icon: '🌿', description: 'Some experience' },
  { id: 'ADVANCED', icon: '🌳', description: 'Expert level' },
];

const HEARD_ABOUT_OPTIONS = [
  { id: 'facebook', icon: '📘', label: 'Facebook' },
  { id: 'website', icon: '🌐', label: 'Website' },
  { id: 'friend', icon: '👥', label: 'Friend' },
  { id: 'other', icon: '💭', label: 'Other' },
];

export function OnboardingFlow({ lang, open, onOpenChange, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { user, setUser } = authStore();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      categoriesNames: [],
      goal: '',
    },
    mode: 'onChange',
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', lang],
    queryFn: () => getCategories(lang),
  });

  const categories = Array.isArray(categoriesData?.body?.data?.categories)
    ? categoriesData.body.data.categories
    : [];
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: OnboardingFormData) => completeOnboarding(data, lang),
    onSuccess: async () => {
      toast.success(t('success:onboarding', 'Welcome aboard! Your profile is all set.'));

      // Immediately update the user in Zustand store to mark onboarding as complete
      if (user && user.id) {
        setUser({ ...user, hasOnboarded: true });
      }

      onComplete?.();
      queryClient.invalidateQueries({ queryKey: ['me', lang] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Onboarding failed:', error);
      toast.error(err.message || t('error:unknown', 'Something went wrong'));
    },
  });

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    form.setValue('categoriesNames', newCategories);
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger('categoriesNames');
    } else if (currentStep === 3) {
      isValid = await form.trigger(['experience', 'heardAboutUs']);
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: OnboardingFormData) => {
    await mutateAsync(data);
  };

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const dialogChange = (open: boolean) => {
    if (!open) {
      form.reset();

      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={dialogChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={e => {
          e.preventDefault();
        }}
        onEscapeKeyDown={e => {
          e.preventDefault();
        }}
        className="w-[90vw] max-w-md border-0 bg-white shadow-xl sm:w-full dark:bg-gray-950"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 h-1.5 overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gray-900 dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <DialogHeader className="space-y-3 pt-10 pb-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-900 dark:border-white">
              <Sparkles className="h-6 w-6 text-gray-900 dark:text-white" />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
            {t('onboarding.title', 'Welcome to LevelUp!')}
          </DialogTitle>

          {/* Subtitle */}
          <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
            {t('onboarding.subtitle', "Let's personalize your experience")}
          </DialogDescription>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'w-8 bg-gray-900 dark:bg-white'
                    : step < currentStep
                      ? 'bg-gray-400 dark:bg-gray-600'
                      : 'bg-gray-200 dark:bg-gray-800'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Categories */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('onboarding.step1.title', 'Choose Your Interests')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          'onboarding.step1.description',
                          "Select the categories you're interested in",
                        )}
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="categoriesNames"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            {isLoadingCategories ? (
                              <div className="flex items-center justify-center py-12">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                {categories.map((category: string) => (
                                  <button
                                    key={category}
                                    type="button"
                                    onClick={() => toggleCategory(category)}
                                    className={`relative rounded-lg border px-6 py-4 transition-all duration-200 ${
                                      selectedCategories.includes(category)
                                        ? 'border-gray-900 bg-gray-50 shadow-sm dark:border-white dark:bg-gray-900'
                                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-gray-600'
                                    }`}
                                  >
                                    {selectedCategories.includes(category) && (
                                      <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                                        <Check className="h-2.5 w-2.5 text-white dark:text-gray-900" />
                                      </div>
                                    )}
                                    <p className="text-center text-sm font-medium text-gray-900 capitalize dark:text-white">
                                      {category}
                                    </p>
                                  </button>
                                ))}
                              </div>
                            )}
                          </FormControl>
                          {form.formState.errors.categoriesNames && (
                            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                              {t(
                                'error.onboarding.categoriesRequired',
                                'Please select at least one category',
                              )}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Step 2: Goal */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('onboarding.step2.title', "What's Your Goal?")}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                          'onboarding.step2.description',
                          'Tell us what you want to achieve (optional)',
                        )}
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                'onboarding.step2.placeholder',
                                'e.g., Learn web development...',
                              )}
                              className="min-h-[120px] resize-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      {t('onboarding.step2.skip', 'Skip this step')}
                    </p>
                  </motion.div>
                )}

                {/* Step 3: Experience & Source */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('onboarding.step3.title', 'Your Experience & How You Found Us')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('onboarding.step3.description', 'Help us tailor your experience')}
                      </p>
                    </div>

                    {/* Experience Level */}
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('onboarding.step3.experienceLabel', 'Experience Level')}
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-3">
                              {EXPERIENCE_LEVELS.map(level => (
                                <button
                                  key={level.id}
                                  type="button"
                                  onClick={() => field.onChange(level.id)}
                                  className={`rounded-lg border p-4 transition-all duration-200 ${
                                    field.value === level.id
                                      ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900'
                                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                                  }`}
                                >
                                  <div className="mb-2 text-2xl">{level.icon}</div>
                                  <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                    {t(`onboarding.step3.experience.${level.id}`, level.id)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {level.description}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          {form.formState.errors.experience && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {t(
                                'error.onboarding.experienceRequired',
                                'Please select your experience level',
                              )}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Heard About Us */}
                    <FormField
                      control={form.control}
                      name="heardAboutUs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('onboarding.step3.heardAboutUsLabel', 'How did you hear about us?')}
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                              {HEARD_ABOUT_OPTIONS.map(option => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => field.onChange(option.id)}
                                  className={`rounded-lg border p-4 transition-all duration-200 ${
                                    field.value === option.id
                                      ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-900'
                                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                                  }`}
                                >
                                  <div className="mb-2 text-xl">{option.icon}</div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {t(`onboarding.step3.heardAboutUs.${option.id}`, option.label)}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          {form.formState.errors.heardAboutUs && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {t(
                                'error.onboarding.heardAboutUsRequired',
                                'Please select an option',
                              )}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isPending}
                  variant="outline"
                  className={`${
                    currentStep === 1 ? 'invisible' : ''
                  } cursor-pointer border-gray-300 dark:border-gray-700`}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('onboarding.buttons.back', 'Back')}
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isPending}
                    className="cursor-pointer bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    {t('onboarding.buttons.next', 'Next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer bg-gray-900 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-gray-900/20 dark:border-t-gray-900" />
                        {t('common.loading', 'Loading...')}
                      </div>
                    ) : (
                      t('onboarding.buttons.finish', 'Complete Setup')
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
