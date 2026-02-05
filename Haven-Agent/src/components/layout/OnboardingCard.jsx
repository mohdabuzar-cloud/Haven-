import React from 'react';
import { cn } from '@/lib/utils';

export const OnboardingCard = ({ 
  children, 
  className,
  title,
  subtitle,
  icon: Icon
}) => {
  return (
    <div className={cn(
      "haven-card p-8 lg:p-10 space-y-6",
      className
    )}>
      {/* Header Section */}
      {(title || subtitle || Icon) && (
        <div className="space-y-3 stagger-children">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 text-primary"
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>
            <span className="font-serif text-lg font-semibold text-heading tracking-tight">
              Haven
            </span>
          </div>
          
          {/* Icon */}
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-2">
              <Icon className="w-6 h-6 text-accent-foreground" />
            </div>
          )}
          
          {/* Title */}
          {title && (
            <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-heading leading-tight">
              {title}
            </h1>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-body text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default OnboardingCard;
