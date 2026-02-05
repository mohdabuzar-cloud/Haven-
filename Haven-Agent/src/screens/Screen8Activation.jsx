import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

export const Screen8Activation = () => {
  const navigate = useNavigate();
  const { setAccountActivated } = useOnboarding();

  const handleActivate = () => {
    setAccountActivated(true);
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={CheckCircle}
        title="Account activated"
        subtitle="Your Haven agent account is now active and ready to use."
      >
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-body">
              Your account has been successfully verified and activated. You now have full access to your Haven agent dashboard and all its features.
            </p>
          </div>

          <Button
            variant="haven"
            size="xl"
            className="w-full"
            onClick={handleActivate}
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen8Activation;
