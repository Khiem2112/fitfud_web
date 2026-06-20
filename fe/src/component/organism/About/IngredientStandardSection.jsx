import React from 'react';
import IngredientCommitment from '../../molecule/About/IngredientCommitment';

export default function IngredientStandardSection() {
  const commitments = [
    '100% Nguyên liệu sạch nguồn gốc rõ ràng',
    'Không gia vị công nghiệp & chất bảo quản',
    'Chế biến nhiệt độ thấp giữ trọn Vitamin'
  ];

  return (
    <section className="bg-bg-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="grid grid-cols-2 gap-4 h-64 sm:h-80">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-premium bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000"
              alt="Ingredient 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-full rounded-xl overflow-hidden shadow-premium bg-gray-200 mt-6">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000"
              alt="Ingredient 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary leading-tight">
            Nguyên liệu bản địa, Tiêu chuẩn<br className="hidden sm:block" /> quốc tế
          </h2>

          <p className="text-lg text-text-muted leading-relaxed pb-2">
            Chúng tôi ưu tiên các loại rau củ quả tươi sạch từ các nông trại đạt chuẩn VietGAP, kết hợp với các siêu thực phẩm nhập khẩu để tối ưu hóa giá trị dinh dưỡng trong từng khẩu phần.
          </p>

          <ul className="flex flex-col gap-4">
            {commitments.map((text, idx) => (
              <IngredientCommitment key={idx} text={text} />
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
