import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';

export const Screen9Success = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation on mount
    const timer = setTimeout(() => setShowConfetti(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <OnboardingLayout>
      <OnboardingCard>
        {/* Success Animation */}
        <div className="py-8 text-center space-y-6">
          {/* Celebration Icon */}
          <div className="relative">
            <div 
              className={`w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-500 ${
                showConfetti ? 'scale-100' : 'scale-0'
              }`}
            >
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            
            {/* Confetti Dots */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-fade-in"
                    style={{
                      backgroundColor: ['hsl(152 35% 42%)', 'hsl(40 70% 60%)', 'hsl(200 60% 50%)', 'hsl(320 50% 60%)'][i % 4],
                      top: `${10 + Math.sin(i * 0.8) * 40}%`,
                      left: `${50 + Math.cos(i * 0.8) * 45}%`,
                      animationDelay: `${i * 100}ms`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-serif font-semibold text-heading">
              You're all set!
            </h1>
            <p className="text-body text-base max-w-sm mx-auto leading-relaxed">
              Your Haven account is now active. Welcome to our trusted network of real estate professionals.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-primary">0</div>
              <div className="text-xs text-helper">Listings</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-primary">Active</div>
              <div className="text-xs text-helper">Status</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-primary">0</div>
              <div className="text-xs text-helper">Leads</div>
            </div>
          </div>
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

export default Screen9Success;
