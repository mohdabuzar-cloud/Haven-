import React from 'react';
import { Home, Building2, Palmtree, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const NewListingModal = ({ isOpen, onClose, onSelect }) => {
  const listingTypes = [
    {
      id: 'sales',
      label: 'Sales',
      icon: Building2,
      description: 'List properties for sale',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'rent',
      label: 'Rent',
      icon: Home,
      description: 'List properties for rent',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    },
    {
      id: 'holiday',
      label: 'Holiday Homes',
      icon: Palmtree,
      description: 'List vacation properties',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-serif font-semibold text-heading">
              Create New Listing
            </h2>
            <p className="text-sm text-body mt-1">
              Select the type of property you want to list
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-helper hover:text-body" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {listingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onSelect(type.id);
                onClose();
              }}
              className={cn(
                "w-full p-4 rounded-xl border-2 border-border transition-all duration-200",
                "flex items-start gap-4 hover:shadow-md"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                type.bgColor
              )}>
                <type.icon className={cn("w-6 h-6", type.color)} />
              </div>
              
              <div className="text-left flex-1">
                <p className="font-semibold text-heading text-sm">
                  {type.label}
                </p>
                <p className="text-xs text-body mt-0.5">
                  {type.description}
                </p>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-border mt-1 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-secondary/30 rounded-b-2xl">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewListingModal;
