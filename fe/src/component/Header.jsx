import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CartPopup } from './organism/CartPopup';
import { CartMode } from '../type/cart';
import logo from '../assets/fitfud-logo.png';

export default function Header() {
  const { user, logout, cartMode, setCartMode, getCartTotals } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const totals = getCartTotals(false); // Header badge should show total items in cart, not just selected

  const handleCartClick = () => {
    // If it's already pinned, click again to close. Otherwise pin it.
    if (cartMode === CartMode.PINNED) {
      setCartMode(CartMode.CLOSED);
    } else {
      setCartMode(CartMode.PINNED);
    }
  };

  const handleCartMouseEnter = () => {
    // Only open on hover if it's currently closed
    if (cartMode === CartMode.CLOSED) {
      setCartMode(CartMode.HOVER);
    }
  };

  const handleCartMouseLeave = () => {
    // Only close on mouse leave if it's currently in hover mode
    if (cartMode === CartMode.HOVER) {
      setCartMode(CartMode.CLOSED);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-text-muted hover:text-primary';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-light bg-bg-card/95 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center rounded-full p-2 text-text-main transition hover:bg-bg-main"
              aria-label="Toggle Menu"
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl leading-none`} aria-hidden="true" />
            </button>
            <Link to="/" className="flex items-center" aria-label="FitFud trang chủ">
              <img
                src={logo}
                alt="FitFud"
                className="h-11 w-auto max-w-[168px] object-contain sm:h-12"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className={`transition-colors ${isActive('/')}`}>
              Trang chủ
            </Link>
            <Link to="/menu" className={`transition-colors ${isActive('/menu')}`}>
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
            {/* Cart Icon & Popup Container */}
            <div
              className="relative flex items-center"
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <button
                onClick={handleCartClick}
                data-cart-icon="true"
                className={`relative rounded-full p-2 transition ${cartMode !== CartMode.CLOSED ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-bg-main hover:text-primary'}`}
                aria-label="Giỏ hàng"
              >
                <i className="bi bi-bag text-[20px] leading-none" aria-hidden="true" />
                {totals.count > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-bg-card animate-pulse">
                    {totals.count}
                  </span>
                )}
              </button>
              <CartPopup mode={cartMode} onClose={() => setCartMode(CartMode.CLOSED)} />
            </div>

            {/* User Account Menu */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 rounded-full bg-primary-light px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                >
                  <i className="bi bi-person-circle text-base leading-none" aria-hidden="true" />
                  <span>{user.full_name}</span>
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-danger font-medium transition"
                >
                  <i className="bi bi-box-arrow-right text-sm leading-none" aria-hidden="true" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-premium hover:bg-primary-dark transition"
              >
                <i className="bi bi-person text-sm leading-none" aria-hidden="true" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full border-t border-border-light bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-2 text-sm font-medium">
              <Link to="/" className={`rounded-xl px-4 py-3 transition-colors hover:bg-bg-main ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-house mr-3" /> Trang chủ
              </Link>
              <Link to="/menu" className={`rounded-xl px-4 py-3 transition-colors hover:bg-bg-main ${isActive('/menu')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-journal-text mr-3" /> Thực đơn
              </Link>
              <Link to="/orders" className={`rounded-xl px-4 py-3 transition-colors hover:bg-bg-main ${isActive('/orders')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-receipt mr-3" /> Đơn hàng
              </Link>
              <Link to="/about" className={`rounded-xl px-4 py-3 transition-colors hover:bg-bg-main ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>
                <i className="bi bi-info-circle mr-3" /> Về chúng tôi
              </Link>
            </nav>
          </div>
        )}
      </header>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-premium">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
              <i className="bi bi-box-arrow-right text-xl leading-none" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-extrabold text-text-main">Xác nhận đăng xuất?</h3>
            <p className="mb-6 text-sm text-text-muted">Bạn có chắc chắn muốn rời khỏi tài khoản hiện tại không?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-border-light px-4 py-3 text-sm font-bold text-text-main hover:bg-bg-main transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                  navigate('/auth');
                }}
                className="flex-1 rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white hover:bg-danger/90 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
