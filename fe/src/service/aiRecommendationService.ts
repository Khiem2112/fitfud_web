import { AiRecommendationInput, AiRecommendationOutput, AiRecommendedDish } from '../type/ai-recommendation.types';
import { mockDishes } from './menuService';

// Giả lập service gọi AI để phân tích và gợi ý
export const fetchAiRecommendations = async (params: AiRecommendationInput): Promise<AiRecommendationOutput> => {
  // Giả lập thời gian AI phân tích (2 giây)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Lấy ra các món từ mockMasterData để làm dữ liệu gợi ý
  // Thực tế AI sẽ trả về kết quả cá nhân hóa

  // Chọn ngẫu nhiên hoặc có chủ đích một vài món
  const recommendedDishIds = ['dish_1', 'dish_2', 'dish_6'];

  const recommendedDishes: AiRecommendedDish[] = recommendedDishIds.map(id => {
    const dish = mockDishes.find(d => d.id === id);
    if (!dish) return null;

    // Giả lập reason dựa trên id
    let reason = "Phù hợp với mục tiêu dinh dưỡng của bạn.";
    if (id === 'dish_1') reason = "Gợi ý vì bạn muốn tăng cơ";
    if (id === 'dish_2') reason = "Phù hợp chế độ Keto";
    if (id === 'dish_6') reason = "Giảm calo, đủ chất";

    const defaultSize = dish.sizes.find(s => s.size_name === 'M') || dish.sizes[0];

    return {
      ...dish,
      price_from: defaultSize.price,
      calories: defaultSize.calories,
      protein: defaultSize.protein,
      carb: defaultSize.carb,
      fat: defaultSize.fat,
      reason
    } as AiRecommendedDish;
  }).filter(Boolean) as AiRecommendedDish[];

  return {
    recommendedDishes,
    generated_at: new Date().toISOString()
  };
};
