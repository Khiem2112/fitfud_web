import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ dishName, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-bold ${className}`}>
      <Link to="/" className="text-text-muted hover:text-primary transition">
        Thực đơn
      </Link>
      <span className="text-text-muted">›</span>
      <span className="text-primary">{dishName || 'Chi tiết món ăn'}</span>
    </div>
  );
}
