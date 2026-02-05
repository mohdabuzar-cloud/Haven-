import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';

export const Screen5Verification = () => {
  const navigate = useNavigate();
  const { submitVerification, refreshStatus, state } = useOnboarding();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  useEffect(() => {
    if (state.verificationStatus === 'approved') {
      navigate('/onboarding/approved');
    } else if (state.verificationStatus === 'rejected' || state.verificationStatus === 'failed') {
      navigate('/onboarding/failed');
    }
  }, [state.verificationStatus, navigate]);

  const handleSubmit = async () => {
    try {
      await submitVerification();
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const isPending = state.verificationStatus === 'pending';

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={Clock}
        title={isPending ? "Waiting for approval" : "Verification in progress"}
        subtitle={isPending ? "Your documents have been submitted. Our team is reviewing them. This usually takes 1-2 business days." : "Our team is reviewing your submitted documents. This usually takes 1-2 business days."}
      >
        {/* Status Card */}
        <div className="p-6 bg-secondary/50 rounded-xl border border-border/30 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 text-primary animate-pulse-soft" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-heading">
              {isPending ? "Awaiting Admin Review" : "Documents Under Review"}
            </h3>
            <p className="text-sm text-helper max-w-xs mx-auto">
              {isPending ? "Your submission is pending admin approval. Check back soon or refresh to see updates." : "You'll receive an email notification once the verification is complete."}
            </p>
          </div>
        </div>

        {/* Submit or Refresh Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full"
          onClick={isPending ? refreshStatus : handleSubmit}
        >
          {isPending ? "Refresh Status" : "Submit for Verification"}
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen5Verification;
