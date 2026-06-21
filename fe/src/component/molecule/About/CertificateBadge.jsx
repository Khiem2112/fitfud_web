import React from 'react';

export default function CertificateBadge({ text }) {
  return (
    <div className="bg-border-light rounded-lg px-8 py-3 flex items-center justify-center min-w-[140px]">
      <span className="font-bold text-text-light text-base">{text}</span>
    </div>
  );
}
