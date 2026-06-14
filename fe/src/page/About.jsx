import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestConsultation } from '../service/aboutService';

export default function About() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Vui lòng nhập họ tên và số điện thoại.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestConsultation({ fullName, phone, note });
      setSuccessMsg(res.message);
      setFullName('');
      setPhone('');
      setNote('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Gửi yêu cầu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 page-enter space-y-16">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full">
          Câu chuyện của chúng tôi
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl leading-tight">
          Hành trình mang lại sức khỏe cho người Việt
        </h1>
        <p className="text-base text-text-muted leading-relaxed">
          Chúng tôi tin rằng bữa ăn ngon không chỉ làm hài lòng vị giác mà còn phải là nguồn năng lượng thuần khiết nhất để bạn sẵn sàng chinh phục mọi thử thách mỗi ngày. FitFud sinh ra với sứ mệnh xóa tan quan niệm "ăn sạch là ăn chán".
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition"
          >
            Khám phá thực đơn
          </Link>
          <a
            href="#consult-form"
            className="rounded-xl border border-border-light bg-bg-card px-6 py-3.5 text-sm font-bold text-text-main hover:bg-bg-main transition"
          >
            Tư vấn miễn phí
          </a>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-main">Cách thức hoạt động</h2>
          <p className="text-sm text-text-muted">Quy trình 3 bước khoa học và khép kín của FitFud</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Phân tích thể trạng',
              desc: 'Dựa trên các chỉ số chiều cao, cân nặng và mục tiêu của bạn, AI của chúng tôi tính toán chính xác nhu cầu dinh dưỡng hàng ngày.'
            },
            {
              step: '2',
              title: 'Thiết kế thực đơn',
              desc: 'Đội ngũ chuyên gia dinh dưỡng và đầu bếp chuyên nghiệp phối hợp xây dựng thực đơn đa dạng, cân bằng đạm, xơ và chất béo tốt.'
            },
            {
              step: '3',
              title: 'Chế biến & Giao nóng',
              desc: 'Món ăn tươi ngon được chuẩn bị vào sáng sớm, giao nóng hổi tận tay bạn mỗi ngày, đảm bảo tối đa sự tiện lợi và tươi mát.'
            }
          ].map((item) => (
            <div key={item.step} className="relative rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium hover:-translate-y-1 transition duration-300">
              <span className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-text-main mt-4 mb-2">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quality Commitments */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-bg-card rounded-3xl p-6 sm:p-10 border border-border-light shadow-premium">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-main leading-tight">
            Nguyên liệu bản địa,<br />Tiêu chuẩn quốc tế
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            Chúng tôi ưu tiên tuyển chọn các loại rau củ tươi sạch từ nông trại đạt chuẩn VietGAP tại Đà Lạt, kết hợp thịt bò/cá hồi tiêu chuẩn nhập khẩu nhằm mang tới hàm lượng vi chất tốt nhất.
          </p>
          <ul className="space-y-3.5">
            {[
              '100% Nguyên liệu sạch nguồn gốc rõ ràng, đạt chuẩn VietGAP',
              'Tuyệt đối không gia vị công nghiệp & chất bảo quản',
              'Chế biến nhiệt độ thấp giữ trọn Vitamin và vị ngon tự nhiên',
              'Hộp đựng bằng bã mía thân thiện với môi trường, an toàn vi sóng'
            ].map((text, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-text-main font-semibold">
                <span className="text-primary text-base leading-none">✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-main p-6 rounded-2xl text-center space-y-1 border border-border-light">
            <span className="text-4xl">🌾</span>
            <p className="font-bold text-sm text-text-main mt-2">VIETGAP</p>
            <p className="text-[10px] text-text-muted">Chứng nhận nông trại sạch</p>
          </div>
          <div className="bg-bg-main p-6 rounded-2xl text-center space-y-1 border border-border-light">
            <span className="text-4xl">🔬</span>
            <p className="font-bold text-sm text-text-main mt-2">ISO 22000</p>
            <p className="text-[10px] text-text-muted">Quy trình vệ sinh an toàn</p>
          </div>
          <div className="bg-bg-main p-6 rounded-2xl text-center space-y-1 border border-border-light">
            <span className="text-4xl">🩺</span>
            <p className="font-bold text-sm text-text-main mt-2">HEALTH CERT</p>
            <p className="text-[10px] text-text-muted">Được khuyên dùng bởi bác sĩ</p>
          </div>
          <div className="bg-bg-main p-6 rounded-2xl text-center space-y-1 border border-border-light">
            <span className="text-4xl">👨‍🍳</span>
            <p className="font-bold text-sm text-text-main mt-2">100% TƯƠI MỚI</p>
            <p className="text-[10px] text-text-muted">Chế biến và giao ngay trong ngày</p>
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section id="consult-form" className="max-w-md mx-auto space-y-6 bg-bg-card border border-border-light rounded-2xl p-6 sm:p-8 shadow-premium">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-text-main">Nhận tư vấn dinh dưỡng miễn phí</h2>
          <p className="text-xs text-text-muted">Để lại thông tin, bác sĩ dinh dưỡng FitFud sẽ kết nối trực tiếp với bạn.</p>
        </div>

        {successMsg && (
          <div className="rounded-lg bg-primary-light border border-primary/30 p-3 text-xs font-semibold text-primary text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleConsultationSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
              Họ tên của bạn
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
              Số điện thoại
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901234567"
              className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
              Ghi chú thêm về mục tiêu (nếu có)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: tôi muốn giảm 3kg mỡ bụng..."
              rows={3}
              className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-center text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'Đang gửi...' : 'Gửi thông tin tư vấn'}
          </button>
        </form>
      </section>

    </div>
  );
}
