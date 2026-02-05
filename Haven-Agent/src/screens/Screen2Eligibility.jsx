import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/OnboardingContext';

export const Screen2Eligibility = () => {
  const navigate = useNavigate();
  const { state, updateEligibility, isEligibilityComplete } = useOnboarding();
  const { eligibility } = state;

  const isComplete = isEligibilityComplete();

  const handleContinue = () => {
    if (isComplete) {
      navigate('/onboarding/details');
    }
  };

  const checkboxItems = [
    {
      id: 'isLicensedAgent',
      label: 'I am a licensed real estate agent',
      checked: eligibility.isLicensedAgent,
    },
    {
      id: 'worksUnderAgency',
      label: 'I work under a registered agency',
      checked: eligibility.worksUnderAgency,
    },
    {
      id: 'agreesToRules',
      label: "I agree to Haven's platform rules",
      checked: eligibility.agreesToRules,
    },
  ];

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={ClipboardCheck}
        title="Confirm your eligibility"
        subtitle="Please confirm the following to proceed with your account setup."
      >
        {/* Checkbox List */}
        <div className="space-y-4 stagger-children">
          {checkboxItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200 cursor-pointer"
              onClick={() => updateEligibility(item.id, !item.checked)}
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onCheckedChange={(checked) => updateEligibility(item.id, checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor={item.id}
                className="text-sm text-body font-normal leading-relaxed cursor-pointer flex-1"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Helper Text */}
        {!isComplete && (
          <p className="text-sm text-helper text-center animate-fade-in">
            Please confirm all items to continue
          </p>
        )}

        {/* CTA Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full mt-2"
          onClick={handleContinue}
          disabled={!isComplete}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen2Eligibility;
