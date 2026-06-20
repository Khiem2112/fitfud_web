import React from 'react';

export default function ProcessCard({ title, desc, icon }) {
  return (
    <div className="flex flex-col items-center bg-bg-card rounded-xl border border-border-light shadow-sm p-6 hover:-translate-y-1 transition-all duration-300 text-center relative mt-8">
      <div className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary-forest text-primary-light shadow-md border-4 border-bg-main">
        <span className="text-2xl">{icon}</span>
      </div>
      
      <div className="pt-8 w-full flex flex-col items-center gap-3">
        <h3 className="text-xl font-bold text-text-main leading-tight">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed px-2">
          {desc}
        </p>
      </div>
    </div>
  );
}
