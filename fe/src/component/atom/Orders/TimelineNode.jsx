import React from 'react';

export const TimelineNode = ({ index, label, isPassed, isActive }) => {
  return (
    <div className="text-center flex flex-col items-center max-w-[80px]">
      <div
        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition duration-300 ${isPassed
            ? 'bg-primary border-primary text-white'
            : 'bg-bg-card border-border-light text-text-muted'
          } ${isActive ? 'ring-4 ring-primary-light ring-offset-0 scale-110' : ''}`}
      >
        {index + 1}
      </div>
      <span className={`text-[9px] mt-2 font-bold ${isPassed ? 'text-primary' : 'text-text-muted'} ${isActive ? 'scale-105' : ''}`}>
        {label}
      </span>
    </div>
  );
};
