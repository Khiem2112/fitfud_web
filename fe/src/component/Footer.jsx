import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/fitfud-logo.png';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-light bg-bg-card transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="mb-2 flex items-center">
              <img src={logo} alt="FitFud" className="h-8 w-auto max-w-[128px] object-contain" />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-text-muted">
              Ăn sạch không có nghĩa là ăn chán. FitFud cung cấp bữa ăn tươi ngon, tối ưu theo chỉ số cơ thể và mục tiêu dinh dưỡng.
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-main">
              Thông tin
            </h3>
            <ul className="space-y-1 text-xs text-text-muted">
              <li><Link to="/about" className="hover:text-primary transition">Giới thiệu dịch vụ</Link></li>
              <li><Link to="/about#privacy" className="hover:text-primary transition">Chính sách bảo mật</Link></li>
              <li><Link to="/about#terms" className="hover:text-primary transition">Điều khoản sử dụng</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">Liên hệ tư vấn</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-main">
              Hỗ trợ
            </h3>
            <ul className="space-y-1 text-xs text-text-muted">
              <li className="flex items-center gap-2 font-medium text-text-main">
                <i className="bi bi-telephone text-primary" aria-hidden="true" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-envelope text-primary" aria-hidden="true" />
                <span>support@fitfud.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-geo-alt text-primary" aria-hidden="true" />
                <span>Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-light pt-3 text-[11px] text-text-muted">
          <p>© 2026 FitFud.</p>
          <div className="flex gap-3">
            <span>VietGAP</span>
            <span>ISO 22000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
