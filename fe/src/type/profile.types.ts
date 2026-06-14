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
  target_calories: number;
  target_protein: number;
  today_calories_logged: number;
  today_protein_logged: number;
  weekly_trend: WeeklyTrendItem[];
};

export type MealLogInput = {
  dish_name: string;
  calories: number;
  protein: number;
  fat?: number;
  carb?: number;
  image_url?: string;
};

export type MealLogOutput = {
  id: string;
  logged_at: string;
} & MealLogInput;
