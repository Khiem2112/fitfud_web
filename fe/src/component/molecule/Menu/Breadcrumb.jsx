import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label
 * @property {string} [path]
 */

/**
 * @param {{ items: BreadcrumbItem[], className?: string }} props
 */
export default function Breadcrumb({ items = [], className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sm font-bold ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.path ? (
              <Link to={item.path} className="text-text-muted hover:text-primary transition">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary" : "text-text-muted"}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-text-muted">›</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
