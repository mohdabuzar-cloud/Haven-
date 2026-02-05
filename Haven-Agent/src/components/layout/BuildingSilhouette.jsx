import React from 'react';

export const BuildingSilhouette = () => {
  return (
    <div className="absolute inset-0 bg-background">
      {/* Skyline background image */}
      <img 
        src="/skyline.jpg" 
        alt="City skyline"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Subtle gradient overlay for better text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        }}
      />
    </div>
  );
};

export default BuildingSilhouette;
