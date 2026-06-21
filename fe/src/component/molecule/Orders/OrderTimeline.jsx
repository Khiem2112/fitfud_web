import React from 'react';
import { TimelineNode } from '../../atom/Orders/TimelineNode';

const STATUS_STEPS = [
  { key: 'Confirmed', label: 'Đã nhận' },
  { key: 'Preparing', label: 'Đang chế biến' },
  { key: 'Delivering', label: 'Đang giao' },
  { key: 'Completed', label: 'Hoàn thành' }
];

const getTimelineProgress = (status) => {
  if (status === 'Cancelled') return 0;
  if (status === 'Pending') return 5;
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  if (idx === -1) return 0;
  return (idx / (STATUS_STEPS.length - 1)) * 100;
};

export const OrderTimeline = ({ status }) => {
  return (
    <div className="relative pt-2">
      {/* Track bar background */}
      <div className="absolute top-4 left-0 right-0 h-1 bg-border-light rounded-full -translate-y-1/2"></div>
      {/* Active track bar fill */}
      <div
        className="absolute top-4 left-0 h-1 bg-primary rounded-full -translate-y-1/2 transition-all duration-500"
        style={{ width: `${getTimelineProgress(status)}%` }}
      ></div>

      {/* Timeline checkpoints */}
      <div className="relative flex justify-between">
        {STATUS_STEPS.map((step, idx) => {
          const s = step.key;
          let isPassed = false;
          let isActive = false;

          if (status === 'Cancelled') {
            isPassed = false; isActive = false;
          } else if (status === 'Pending') {
            isPassed = false; isActive = false;
          } else {
            const currIdx = STATUS_STEPS.findIndex(x => x.key === status);
            if (currIdx >= idx) isPassed = true;
            if (currIdx === idx) isActive = true;
          }

          return (
            <TimelineNode key={s} index={idx} label={step.label} isPassed={isPassed} isActive={isActive} />
          );
        })}
      </div>
    </div>
  );
};
