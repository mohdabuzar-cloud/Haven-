import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, Check, RefreshCw } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';
import { cn } from '@/lib/utils';

const documentLabels = {
  emiratesId: 'Emirates ID',
  workVisa: 'Work Visa',
  brokerLicense: 'Broker License',
};

export const Screen6Failed = () => {
  const navigate = useNavigate();
  const { state, updateDocument, areFailedDocumentsFixed } = useOnboarding();
  const { documents, failedDocuments } = state;

  const canResubmit = areFailedDocumentsFixed();

  const handleResubmit = () => {
    if (canResubmit) {
      navigate('/onboarding/documents');
    }
  };

  return (
    <OnboardingLayout>
      <OnboardingCard
        title="Verification requires attention"
        subtitle="Some documents couldn't be verified. Please review and re-upload the highlighted items."
      >
        {/* Alert Banner */}
        <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-heading">
              Documents need to be re-uploaded
            </p>
            <p className="text-sm text-helper">
              The following documents require your attention
            </p>
          </div>
        </div>

        {/* Failed Documents List */}
        <div className="space-y-3 stagger-children">
          {failedDocuments.map((docId) => {
            const isFixed = documents[docId];
            
            return (
              <div
                key={docId}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                  isFixed
                    ? "border-primary/30 bg-accent/50"
                    : "border-destructive/30 bg-destructive/5"
                )}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className={cn(
                    "text-sm font-medium",
                    isFixed ? "text-heading" : "text-destructive"
                  )}>
                    {documentLabels[docId]}
                  </h3>
                  <p className="text-xs text-helper mt-0.5">
                    {isFixed ? 'Ready for resubmission' : 'Verification failed — please re-upload'}
                  </p>
                </div>
                
                <Button
                  variant={isFixed ? "ghost" : "destructive"}
                  size="sm"
                  className={cn(
                    "flex-shrink-0 min-w-[130px]",
                    isFixed && "text-primary hover:bg-primary/10"
                  )}
                  onClick={() => updateDocument(docId, !isFixed)}
                >
                  {isFixed ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Ready
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1" />
                      Re-upload
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Helper Text */}
        {!canResubmit && (
          <p className="text-sm text-destructive text-center animate-fade-in">
            Please re-upload all failed documents to continue
          </p>
        )}

        {/* CTA Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full mt-2"
          onClick={handleResubmit}
          disabled={!canResubmit}
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Resubmit Documents
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen6Failed;
