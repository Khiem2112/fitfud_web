import React from 'react';

export default function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <span className={`flex items-center justify-center text-primary flex-shrink-0 ${className}`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
      </svg>
    </span>
  );
}
