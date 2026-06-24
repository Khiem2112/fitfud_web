export type AiRecommendationSource = 'PROFILE_PAGE' | 'HOME_CTA' | 'DIRECT_ACCESS';

export type AiRecommendationInput = {
  profileId: string;
  limit?: number;
};

export type AiRecommendedDish = {
  id: string;
  dish_name: string;
  description?: string;
  image_url?: string;
  price_from: number;
  calories: number;
  protein: number;
  carb?: number;
  fat?: number;
  diet_tags: string[];
  reason: string;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  sizes: Array<{
    size_name: string;
    price: number;
    calories: number;
  }>;
};

export type AiRecommendationOutput = {
  recommendedDishes: AiRecommendedDish[];
  generated_at: string;
};
