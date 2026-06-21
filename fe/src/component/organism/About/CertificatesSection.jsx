import React from 'react';
import CertificateBadge from '../../molecule/About/CertificateBadge';

export default function CertificatesSection() {
  const badges = ["HEALTH CERT", "ISO 22000", "VIETGAP"];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-8 relative z-20">
      <div className="bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center gap-6">

        <div className="text-accent-dark">
          <svg className="w-8 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold text-primary-dark">
            Được chứng nhận bởi chuyên gia dinh dưỡng
          </h2>
          <p className="text-lg text-text-muted">
            Mỗi thực đơn tại FitFud đều được thẩm định bởi đội ngũ bác sĩ và chuyên gia dinh dưỡng hàng đầu, đảm bảo tính khoa học và hiệu quả cho người sử dụng.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-4 w-full">
          {badges.map((badge, idx) => (
            <CertificateBadge key={idx} text={badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
