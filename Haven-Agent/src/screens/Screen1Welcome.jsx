import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/context/OnboardingContext';

export const Screen1Welcome = () => {
  const navigate = useNavigate();
  const { registerUser, loginUser, loading } = useOnboarding();
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleStart = async () => {
    try {
      if (mode === 'signup') {
        const required = ['fullName', 'email', 'phone', 'password'];
        const missing = required.find(k => !form[k]?.trim());
        if (missing) {
          const labels = { fullName: 'Full name', email: 'Email', phone: 'Phone', password: 'Password' };
          alert(`Please fill in: ${labels[missing]}`);
          return;
        }
        const res = await registerUser(form);
        if (res?.token) {
          // New user: go through all onboarding steps
          navigate('/onboarding/eligibility');
        }
      } else {
        // Login: existing user
        if (!form.email?.trim() || !form.password?.trim()) {
          alert('Please fill in Email and Password');
          return;
        }
        const res = await loginUser({ email: form.email, password: form.password });
        // Check if onboarding is complete
        console.log('Login response:', res);
        if (res?.onboardingComplete) {
          // User already completed onboarding: go directly to dashboard
          navigate('/dashboard');
        } else {
          // User hasn't completed onboarding: go to appropriate screen
          navigate('/onboarding/eligibility');
        }
      }
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        title={mode === 'signup' ? 'Create your account' : 'Welcome back'}
        subtitle={mode === 'signup' ? 'Join Haven\'s trusted network of real estate professionals' : 'Sign in to your Haven account'}
      >
        {/* Form Fields */}
        <div className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="pl-10"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="pl-10"
            />
          </div>

          {mode === 'signup' && (
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="pl-10"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-10"
            />
          </div>

          <Button
            variant="haven"
            size="xl"
            className="w-full"
            onClick={handleStart}
            disabled={loading}
          >
            {mode === 'signup' ? 'Create Account' : 'Log In'}
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === 'signup' 
                ? 'Already have an account? Log in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl mt-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-heading">
              Secure & Compliant
            </p>
            <p className="text-sm text-helper leading-relaxed">
              Your information is encrypted and handled according to regulatory standards.
            </p>
          </div>
        </div>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen1Welcome;
