export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';
export type HealthGoal = 'Weight Loss' | 'Muscle Gain' | 'Healthy Eating' | 'Calorie Control' | 'Maintain Weight' | 'Convenience';
export type Gender = 'Male' | 'Female' | 'Other';
export type DietPreference = 'Bình thường' | 'Eat Clean' | 'Keto' | 'Chay';

export type SurveyInput = {
  health_goal: HealthGoal;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  activity_level: ActivityLevel;
  diet_preference: DietPreference;
  allergyIds: string[];
};

export type SurveyOutput = {
  profileId: string;
  target_calories: number;
  target_protein: number;
  bmi: number;
  tdee: number;
};

export type SurveyMasterDataOutput = {
  healthGoals: {
    id: HealthGoal;
    name: string;
    description?: string;
  }[];
  activityLevels: {
    id: ActivityLevel;
    name: string;
    description?: string;
  }[];
  dietPreferences: {
    id: DietPreference;
    name: string;
  }[];
  allergies: {
    id: string;
    name: string;
    triggers?: string[];
  }[];
};

export type SurveyDraft = {
  step: number;
  formData: Partial<SurveyInput>;
  updatedAt: number;
};

export type SurveyStore = {
  draft: SurveyDraft | null;
  saveDraft: (data: Partial<SurveyDraft>) => void;
  clearDraft: () => void;
};
