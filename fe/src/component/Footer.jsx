import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-light bg-bg-card transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-1.5 text-xl font-bold text-primary mb-4">
              🌱 FitFud
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              "Life's Too Short for Boring Chicken." Ăn sạch không có nghĩa là ăn chán. Chúng tôi cung cấp các bữa ăn tươi ngon nhất được tối ưu hóa theo chỉ số cơ thể bởi chuyên gia dinh dưỡng.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-text-main uppercase mb-4">
              Thông tin & Chính sách
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link to="/about" className="hover:text-primary transition">Giới thiệu dịch vụ</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">Điều khoản sử dụng</a>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition">Liên hệ tư vấn</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-text-main uppercase mb-4">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="font-medium text-text-main">📞 1900 1234 (8:00 - 20:00)</li>
              <li>✉️ support@fitfud.vn</li>
              <li>📍 Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border-light pt-8 flex items-center justify-between text-xs text-text-muted">
          <p>© 2026 FitFud - Dinh dưỡng cho cuộc sống năng động.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-primary">VietGAP Certified</span>
            <span className="cursor-pointer hover:text-primary">ISO 22000</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
