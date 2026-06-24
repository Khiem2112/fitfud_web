export type WeeklyTrendItem = {
  day: string; // T2, T3...
  calories: number;
  protein: number;
};

export type ProfileDashboardOutput = {
  fullName: string;
  weight: number;
  height: number;
  bmi: number;
  tdee: number;
  health_goal?: string;

  target_calories: number;
  target_protein: number;
  today_calories_logged: number;
  today_protein_logged: number;

  weekly_trend: WeeklyTrendItem[];

  defaultAddress?: {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    full_address: string;
  };

  addresses?: {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    full_address: string;
  }[];


  aiRecommendedDishes?: {
    id: string;
    dish_name: string;
    image_url?: string;
    reason: string;
    price_from: number;
    calories?: number;
    protein?: number;
    status: 'Active' | 'Inactive' | 'Out of Stock';
    originalDish?: any;
  }[];

  recentMeals?: {
    id: string;
    dish_name: string;
    calories?: number;
    protein?: number;
    carb?: number;
    fat?: number;
    logged_at: string;
    source: 'FitFudDish' | 'Manual' | 'AIImage';
    dish_id?: string;
  }[];
};

export type UpdateProfileHealthInput = {
  weight?: number;
  height?: number;
  health_goal?: string;
};

export type UpdateProfileHealthOutput = {
  success: boolean;
  bmi: number;
  tdee: number;
  target_calories: number;
  target_protein: number;
};

export type MealLogInput = {
  dish_name: string;
  calories: number;
  protein: number;
  fat?: number;
  carb?: number;
  image_url?: string;
  dish_id?: string;
  source: 'FitFudDish' | 'Manual' | 'AIImage';
};

export type MealLogOutput = {
  id: string;
  logged_at: string;
} & MealLogInput;

export type SearchFitFudDishForLogOutput = {
  dishes: {
    id: string;
    dish_name: string;
    image_url?: string;
    calories?: number;
    protein?: number;
    carb?: number;
    fat?: number;
  }[];
};

export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
