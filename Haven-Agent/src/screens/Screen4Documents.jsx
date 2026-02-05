import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Check, ArrowRight } from 'lucide-react';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { OnboardingCard } from '@/components/layout/OnboardingCard';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/context/OnboardingContext';
import { cn } from '@/lib/utils';

export const Screen4Documents = () => {
  const navigate = useNavigate();
  const { state, updateDocument, areAllDocumentsUploaded } = useOnboarding();
  const { documents } = state;
  const fileInputs = {
    emiratesId: useRef(null),
    workVisa: useRef(null),
    brokerLicense: useRef(null),
  };

  const isComplete = areAllDocumentsUploaded();

  const handleFileUpload = async (docType) => {
    const file = fileInputs[docType].current?.files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }
    try {
      await updateDocument(docType, file);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleSubmit = () => {
    if (isComplete) {
      navigate('/onboarding/verification');
    }
  };

  const documentItems = [
    {
      id: 'emiratesId',
      title: 'Emirates ID',
      description: 'Valid government-issued Emirates ID',
      uploaded: documents.emiratesId,
    },
    {
      id: 'workVisa',
      title: 'Work Visa',
      description: 'Current valid work visa or residence permit',
      uploaded: documents.workVisa,
    },
    {
      id: 'brokerLicense',
      title: 'Broker License',
      description: 'RERA or equivalent broker license',
      uploaded: documents.brokerLicense,
    },
  ];

  return (
    <OnboardingLayout>
      <OnboardingCard
        icon={FileText}
        title="Upload your documents"
        subtitle="Submit the required documents for compliance verification."
      >
        {/* Document List */}
        <div className="space-y-3 stagger-children">
          {documentItems.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                doc.uploaded
                  ? "border-primary/30 bg-accent/50"
                  : "border-border/50 bg-secondary/30 hover:border-border"
              )}
            >
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-sm font-medium text-heading">
                  {doc.title}
                </h3>
                <p className="text-xs text-helper mt-0.5 truncate">
                  {doc.description}
                </p>
              </div>
              
              <Button
                variant={doc.uploaded ? "ghost" : "haven-outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0 min-w-[130px]",
                  doc.uploaded && "text-primary hover:bg-primary/10"
                )}
                onClick={() => {
                  fileInputs[doc.id].current?.click();
                }}
              >
                {doc.uploaded ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Hidden File Inputs */}
        {documentItems.map((doc) => (
          <input
            key={doc.id}
            ref={fileInputs[doc.id]}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={() => handleFileUpload(doc.id)}
            className="hidden"
          />
        ))}

        {/* Helper Text */}
        {!isComplete && (
          <p className="text-sm text-helper text-center animate-fade-in">
            Please upload all documents to continue
          </p>
        )}

        {/* CTA Button */}
        <Button
          variant="haven"
          size="xl"
          className="w-full"
          onClick={handleSubmit}
          disabled={!isComplete}
        >
          Submit for Verification
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </OnboardingCard>
    </OnboardingLayout>
  );
};

export default Screen4Documents;
