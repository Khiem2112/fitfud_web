import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { user, logout, cartOpen, setCartOpen, getCartTotals } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const totals = getCartTotals();

  const handleCartClick = () => {
    setCartOpen(!cartOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-text-muted hover:text-primary';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-light bg-bg-card/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-primary">
            <span className="flex items-center justify-center rounded-lg bg-primary-light p-1.5 text-primary">
              🌱
            </span>
            <span>FitFud</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={`transition-colors ${isActive('/')}`}>
            Thực đơn
          </Link>
          <Link to="/orders" className={`transition-colors ${isActive('/orders')}`}>
            Đơn hàng
          </Link>
          <Link to="/about" className={`transition-colors ${isActive('/about')}`}>
            Về chúng tôi
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={handleCartClick}
            className="relative rounded-full p-2 text-text-muted hover:bg-bg-main hover:text-primary transition"
            aria-label="Giỏ hàng"
          >
            <span className="text-xl">🛒</span>
            {totals.count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-bg-card animate-pulse">
                {totals.count}
              </span>
            )}
          </button>

          {/* User Account Menu */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
              >
                👤 {user.full_name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/auth');
                }}
                className="text-xs text-text-muted hover:text-danger font-medium transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-premium hover:bg-primary-dark transition"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
