export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';
export type HealthGoal = 'Weight Loss' | 'Muscle Gain' | 'Eat Clean' | 'Calorie Control' | 'Convenience';
export type Gender = 'Male' | 'Female' | 'Other';

export type SurveyInput = {
  health_goal: HealthGoal;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  activity_level: ActivityLevel;
  allergyIds: string[];
  cuisine_preference?: string;
};

export type SurveyOutput = {
  profileId: string;
  target_calories: number;
  target_protein: number;
  bmi: number;
  tdee: number;
};
