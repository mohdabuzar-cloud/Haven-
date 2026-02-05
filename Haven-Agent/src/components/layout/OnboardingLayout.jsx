import React from 'react';
import { BuildingSilhouette } from './BuildingSilhouette';

export const OnboardingLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Onboarding Content */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {children}
        </div>
      </div>
      
      {/* Right Side - Building Silhouette */}
      <div className="hidden lg:block lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <BuildingSilhouette />
      </div>
    </div>
  );
};

export default OnboardingLayout;
