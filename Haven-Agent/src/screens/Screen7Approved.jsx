import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';

export const Screen7Approved = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        title="Verification approved!"
        subtitle="Congratulations! Your documents have been verified successfully."
      >
        {/* Success Illustration */}
        <div className="py-6 text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-soft" />
            <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-semibold text-heading">
              Welcome to Haven
            </h3>
            <p className="text-sm text-helper max-w-xs mx-auto">
              Your account is now active and ready to use.
            </p>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="p-4 bg-accent/50 rounded-xl border border-primary/10 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-heading">What's next?</span>
          </div>
          <ul className="space-y-2 text-sm text-body">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Access your personalized dashboard
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Start listing and managing properties
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              Connect with clients and grow your business
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full"
          onClick={handleGoToDashboard}
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen7Approved;
