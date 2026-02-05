import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/context/OnboardingContext';

export const Screen3BasicDetails = () => {
  const navigate = useNavigate();
  const { state, updateBasicDetails, isBasicDetailsValid } = useOnboarding();
  const { basicDetails } = state;
  
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  // Validation functions
  const validateField = useMemo(() => ({
    fullName: (value) => {
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
      return null;
    },
    phone: (value) => {
      if (!value.trim()) return 'Phone number is required';
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
      return null;
    },
  }), []);

  const errors = useMemo(() => ({
    fullName: touched.fullName ? validateField.fullName(basicDetails.fullName) : null,
    email: touched.email ? validateField.email(basicDetails.email) : null,
    phone: touched.phone ? validateField.phone(basicDetails.phone) : null,
  }), [basicDetails, touched, validateField]);

  const isValid = isBasicDetailsValid();

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleContinue = () => {
    // Mark all as touched
    setTouched({ fullName: true, email: true, phone: true });
    
    if (isValid) {
      navigate('/onboarding/documents');
    }
  };

  const inputFields = [
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full legal name',
      value: basicDetails.fullName,
      error: errors.fullName,
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      value: basicDetails.email,
      error: errors.email,
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+971 50 123 4567',
      value: basicDetails.phone,
      error: errors.phone,
    },
  ];

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={User}
        title="Tell us about yourself"
        subtitle="Please provide your details for identity verification."
      >
        {/* Form Fields */}
        <div className="space-y-5 stagger-children">
          {inputFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label 
                htmlFor={field.id}
                className="text-sm font-medium text-heading"
              >
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => updateBasicDetails(field.id, e.target.value)}
                onBlur={() => handleBlur(field.id)}
                className={`h-12 px-4 text-base ${
                  field.error 
                    ? 'border-destructive focus-visible:ring-destructive/30' 
                    : 'focus-visible:ring-primary/30'
                }`}
              />
              {field.error && (
                <p className="text-sm text-destructive animate-fade-in">
                  {field.error}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full mt-4"
          onClick={handleContinue}
          disabled={!isValid}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen3BasicDetails;
