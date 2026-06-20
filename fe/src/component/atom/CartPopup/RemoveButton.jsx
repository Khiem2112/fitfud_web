import React from 'react';

export const RemoveButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-xs text-text-muted hover:text-danger shrink-0"
    title="Xóa món"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
    </svg>
  </button>
);
