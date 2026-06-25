import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickLinksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#f8f9f9] py-12 md:py-16 px-6 md:px-12 flex justify-center border-b border-dashed border-blue-500">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6">
        
        {/* About FitFud */}
        <div className="flex-1 bg-[#2f6a4f] p-8 md:p-10 rounded-3xl flex flex-col justify-between items-start shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center mb-1">
              <i className="bi bi-info-circle text-lg leading-none text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">Về FitFud</h3>
            <p className="text-white/80 text-sm mt-1 leading-relaxed max-w-sm">
              Khám phá sứ mệnh và câu chuyện của chúng tôi trong việc mang đến dinh dưỡng sạch cho người Việt.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/about')}
            className="mt-8 px-6 py-2.5 bg-white text-[#2f6a4f] text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Tìm hiểu thêm
          </button>
        </div>

        {/* Your Orders */}
        <div className="flex-1 bg-[#f59e0b] p-8 md:p-10 rounded-3xl flex flex-col justify-between items-start shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="w-8 h-8 flex items-center mb-1">
              <i className="bi bi-truck text-2xl leading-none text-[#78350f]" aria-hidden="true" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#78350f]">Đơn hàng của bạn</h3>
            <p className="text-[#78350f]/80 text-sm mt-1 leading-relaxed max-w-sm">
              Kiểm tra trạng thái các bữa ăn đang trên đường đến với bạn hoặc xem lại lịch sử đặt hàng.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/orders')}
            className="mt-8 px-6 py-2.5 bg-[#78350f] text-[#f59e0b] text-sm font-bold rounded-lg hover:bg-[#5c2709] transition-colors shadow-sm"
          >
            Xem đơn hàng
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuickLinksSection;
