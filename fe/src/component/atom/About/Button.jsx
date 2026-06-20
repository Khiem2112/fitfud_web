import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({ to, variant = 'primary', children, className = '' }) {
  const baseClasses = "inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold transition-all duration-300";
  
  const variants = {
    primary: "bg-primary text-white shadow-premium hover:bg-opacity-90",
    accent: "bg-accent-dark text-white hover:bg-opacity-90",
    outline: "border border-primary-light text-primary-light hover:bg-primary-light hover:text-primary-forest"
  };

  return (
    <Link to={to} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
