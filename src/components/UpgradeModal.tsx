'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Users, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toastActions } from '@/stores/toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSubscriptionPlans, initializeKhaltiPayment } from '@/lib/services/payment';
import LanguageStore from '@/stores/useLanguage';
import type { SubscriptionPlan } from '@/lib/types/payment';

interface UpgradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
  const { language } = LanguageStore();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  // Fetch subscription plans with React Query
  const { data: subscriptionPlans = [] as SubscriptionPlan[], isLoading: loading } = useQuery({
    queryKey: ['subscriptionPlans', language],
    queryFn: () => getSubscriptionPlans(language),
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Initialize payment mutation
  const paymentMutation = useMutation({
    mutationFn: ({ planId, price }: { planId: string; price: number }): Promise<void> =>
      initializeKhaltiPayment(planId, price, language),
    onSuccess: () => {
      // Payment initialized successfully
    },
    onError: (error: Error) => {
      console.error('Error initializing payment:', error);
      toastActions.error(error.message);
      setProcessingPlanId(null);
    },
  });

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setProcessingPlanId(plan.id);
    paymentMutation.mutate({ planId: plan.id, price: plan.price });
  };

  // Find Pro and Community plans
  const proPlan = subscriptionPlans.find(p => p.planName.toLowerCase().includes('pro'));
  const communityPlan = subscriptionPlans.find(
    p =>
      p.planName.toLowerCase().includes('community') || p.planName.toLowerCase().includes('team'),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">Upgrade Your Profile</DialogTitle>
          <DialogDescription className="text-center">
            Choose the plan that fits your needs
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {/* Pro Plan */}
            {proPlan && (
              <div className="relative rounded-2xl border-2 border-zinc-800 bg-zinc-950 p-8 text-white">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-zinc-900">
                  POPULAR
                </Badge>

                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{proPlan.planName}</h3>
                    <p className="text-sm text-zinc-400">For serious habit builders.</p>
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <span className="text-5xl font-bold">Rs {proPlan.price}</span>
                  <span className="text-zinc-400">
                    /{proPlan.durationMonth} month{proPlan.durationMonth > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {proPlan.features && proPlan.features.length > 0 ? (
                    proPlan.features.map((feature, index) => (
                      <FeatureItem key={index} text={feature} />
                    ))
                  ) : (
                    <div className="text-center text-zinc-400 text-sm">No features listed</div>
                  )}
                </div>

                <Button
                  className="w-full bg-white text-zinc-900 hover:bg-zinc-100"
                  onClick={() => handleUpgrade(proPlan)}
                  disabled={processingPlanId === proPlan.id}
                >
                  {processingPlanId === proPlan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upgrade to Pro'
                  )}
                </Button>
              </div>
            )}

            {/* Community/Team Plan */}
            {communityPlan && (
              <div className="rounded-2xl border-2 border-zinc-800 bg-zinc-950 p-8 text-white">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{communityPlan.planName}</h3>
                    <p className="text-sm text-zinc-400">For squads and organizations.</p>
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <span className="text-5xl font-bold">Rs {communityPlan.price}</span>
                  <span className="text-zinc-400">
                    /{communityPlan.durationMonth} month{communityPlan.durationMonth > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {communityPlan.features && communityPlan.features.length > 0 ? (
                    communityPlan.features.map((feature, index) => (
                      <FeatureItem key={index} text={feature} />
                    ))
                  ) : (
                    <div className="text-center text-zinc-400 text-sm">No features listed</div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                  onClick={() => handleUpgrade(communityPlan)}
                  disabled={processingPlanId === communityPlan.id}
                >
                  {processingPlanId === communityPlan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upgrade to Community'
                  )}
                </Button>
              </div>
            )}

            {/* Show message if no plans found */}
            {!loading && subscriptionPlans.length === 0 && (
              <div className="col-span-2 text-center py-10 text-zinc-500">
                No subscription plans available at the moment.
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <Check className="h-5 w-5 shrink-0 text-white mt-0.5" />
      <span className="text-sm text-zinc-300">{text}</span>
    </div>
  );
}
