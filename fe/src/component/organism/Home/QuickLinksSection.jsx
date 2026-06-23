import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, PackageCheck } from 'lucide-react';

const QuickLinksSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-bg-main py-16 md:py-24 px-6 md:px-12 flex justify-center">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-8">
        
        {/* About FitFud */}
        <div className="flex-1 bg-primary-forest p-10 md:p-12 rounded-[40px] flex flex-col justify-between items-start min-h-[320px] shadow-premium">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-2">
              <Info className="w-6 h-6 text-primary-forest" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Về FitFud</h3>
            <p className="text-primary-light text-lg mt-2 leading-relaxed">
              Khám phá sứ mệnh và câu chuyện của chúng tôi trong việc mang đến dinh dưỡng sạch cho người Việt.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/about')}
            className="mt-10 px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
          >
            Tìm hiểu thêm
          </button>
        </div>

        {/* Your Orders */}
        <div className="flex-1 bg-accent p-10 md:p-12 rounded-[40px] flex flex-col justify-between items-start min-h-[320px] shadow-premium">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-12 bg-[#663B00]/10 rounded-xl flex items-center justify-center mb-2">
              <PackageCheck className="w-6 h-6 text-[#663B00]" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#663B00]">Đơn hàng của bạn</h3>
            <p className="text-[#663B00]/80 text-lg mt-2 leading-relaxed">
              Kiểm tra trạng thái các bữa ăn đang trên đường đến với bạn hoặc xem lại lịch sử đặt hàng.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/orders')}
            className="mt-10 px-8 py-4 bg-[#663B00] text-accent font-bold rounded-2xl hover:bg-[#4d2c00] transition-colors shadow-sm hover:shadow-md"
          >
            Xem đơn hàng
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuickLinksSection;
