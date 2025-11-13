'use client';

import { useState } from 'react';
import { Check, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

const steps = [
  { id: 1, title: 'Business details', completed: true },
  { id: 2, title: 'Company information', completed: true },
  { id: 3, title: 'Headquarters', completed: true },
  { id: 4, title: 'Tax options', completed: false },
  { id: 5, title: 'Capital structure', completed: false },
];

export default function BagPage() {
  const [currentStep, setCurrentStep] = useState(4);
  const [selectedMode, setSelectedMode] = useState<string>('guided');

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar - Step Progress */}
      <aside className="hidden w-80 border-r border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
        <div className="space-y-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Setup Progress
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Complete all steps to finish setup
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      step.completed
                        ? 'border-[#230254] bg-[#230254] text-white'
                        : step.id === currentStep
                          ? 'border-[#230254] bg-white text-[#230254] dark:bg-zinc-900'
                          : 'border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mt-2 h-12 w-0.5 ${
                        step.completed ? 'bg-[#230254]' : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 pt-2">
                  <h3
                    className={`text-sm font-semibold ${
                      step.id === currentStep
                        ? 'text-zinc-900 dark:text-zinc-50'
                        : step.completed
                          ? 'text-zinc-700 dark:text-zinc-300'
                          : 'text-zinc-500 dark:text-zinc-500'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.id === currentStep && (
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">In progress</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Step {currentStep}</span>
              <ChevronRight className="h-4 w-4" />
              <span>{steps[currentStep - 1]?.title}</span>
            </div>
            <h1 className="font-heading text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Tax options
            </h1>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
              Select how you&apos;d like to configure your tax settings. Guided mode provides
              step-by-step assistance, while manual entry gives you full control.
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            {/* Mode Selection */}
            <div>
              <Label className="mb-4 block text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Configuration mode
              </Label>
              <RadioGroup
                value={selectedMode}
                onValueChange={setSelectedMode}
                className="space-y-3"
              >
                <Card className="relative cursor-pointer border-2 p-6 transition-all hover:border-[#230254] has-[:checked]:border-[#230254] has-[:checked]:bg-[#230254]/5">
                  <div className="flex items-start gap-4">
                    <RadioGroupItem
                      value="guided"
                      id="guided"
                      className="mt-1 border-2 border-zinc-300 data-[state=checked]:border-[#230254] data-[state=checked]:bg-[#230254]"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="guided"
                        className="flex cursor-pointer items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50"
                      >
                        Guided mode
                        <span className="rounded-full bg-[#5BA85A] px-3 py-1 text-xs font-medium text-white">
                          Recommended
                        </span>
                      </Label>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Answer a few simple questions and we&apos;ll configure everything for you.
                        Perfect for getting started quickly.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="relative cursor-pointer border-2 p-6 transition-all hover:border-[#230254] has-[:checked]:border-[#230254] has-[:checked]:bg-[#230254]/5">
                  <div className="flex items-start gap-4">
                    <RadioGroupItem
                      value="manual"
                      id="manual"
                      className="mt-1 border-2 border-zinc-300 data-[state=checked]:border-[#230254] data-[state=checked]:bg-[#230254]"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="manual"
                        className="cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-50"
                      >
                        Manual entry
                      </Label>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Configure all settings manually. Best for users who know exactly what they
                        need.
                      </p>
                    </div>
                  </div>
                </Card>
              </RadioGroup>
            </div>

            {/* Info Banner */}
            <Card className="border-[#0EA5E9] bg-[#0EA5E9]/10 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-[#0EA5E9]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Tax configurations can be updated later
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Don&apos;t worry if you&apos;re not sure right now. You can always change these settings
                    in your dashboard after setup is complete.
                  </p>
                </div>
              </div>
            </Card>

            {/* Conditional Form Fields - Only show if manual mode */}
            {selectedMode === 'manual' && (
              <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-heading text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Financial Year Details
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startMonth" className="text-sm font-medium">
                      Financial year start month
                    </Label>
                    <Input
                      id="startMonth"
                      type="text"
                      placeholder="e.g., January"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endMonth" className="text-sm font-medium">
                      Financial year end month
                    </Label>
                    <Input
                      id="endMonth"
                      type="text"
                      placeholder="e.g., December"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-sm font-medium">
                    Tax identification number
                  </Label>
                  <Input id="taxId" type="text" placeholder="Enter your tax ID" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vatNumber" className="text-sm font-medium">
                    VAT number (if applicable)
                  </Label>
                  <Input id="vatNumber" type="text" placeholder="Optional" className="h-11" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              Back
            </Button>
            <Button
              size="lg"
              onClick={handleNext}
              className="cursor-pointer bg-[#230254] hover:bg-[#230254]/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={currentStep === steps.length}
            >
              {selectedMode === 'guided' ? 'Generate recommendations' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
