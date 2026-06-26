import { SurveyInput, SurveyOutput, SurveyMasterDataOutput } from '../type/survey.types';
import { updateCurrentUserSurveyStatus } from './authService';
import { healthGoals, activityLevels, dietPreferences } from '../seed/healthMetrics';
import { allergies } from '../seed/allergies';

const PROFILE_KEY_PREFIX = 'fitfud_profile_';

export const fetchSurveyMasterData = async (): Promise<SurveyMasterDataOutput> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    healthGoals,
    activityLevels,
    dietPreferences,
    allergies
  };
};

export const submitSurvey = async (input: SurveyInput, userId: string): Promise<SurveyOutput> => {
  // Simulate API delay (AI analysis simulation)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 1. Calculate BMI
  const heightInMeters = input.height / 100;
  const bmi = Number((input.weight / (heightInMeters * heightInMeters)).toFixed(1));

  // 2. Calculate BMR (Harris-Benedict Equation)
  let bmr = 0;
  if (input.gender === 'Male') {
    bmr = 88.362 + 13.397 * input.weight + 4.799 * input.height - 5.677 * input.age;
  } else if (input.gender === 'Female') {
    bmr = 447.593 + 9.247 * input.weight + 3.098 * input.height - 4.330 * input.age;
  } else {
    bmr = 260 + 11.3 * input.weight + 4.0 * input.height - 5.0 * input.age;
  }

  // 3. Calculate TDEE based on activity level
  let multiplier = 1.2;
  switch (input.activity_level) {
    case 'Sedentary':
      multiplier = 1.2;
      break;
    case 'Lightly Active':
      multiplier = 1.375;
      break;
    case 'Moderately Active':
      multiplier = 1.55;
      break;
    case 'Very Active':
      multiplier = 1.725;
      break;
    case 'Extra Active':
      multiplier = 1.9;
      break;
  }
  const tdee = Math.round(bmr * multiplier);

  // 4. Adjust calorie target based on health goal
  let target_calories = tdee;
  if (input.health_goal === 'Weight Loss') {
    target_calories = Math.max(1200, tdee - 500);
  } else if (input.health_goal === 'Muscle Gain') {
    target_calories = tdee + 300;
  }

  // 5. Calculate protein target based on health goal and body weight
  let proteinMultiplier = 1.5; // g/kg
  if (input.health_goal === 'Muscle Gain' || input.health_goal === 'Weight Loss') {
    proteinMultiplier = 2.0;
  }
  const target_protein = Math.round(input.weight * proteinMultiplier);

  const result: SurveyOutput = {
    profileId: 'profile_' + Date.now(),
    target_calories,
    target_protein,
    bmi,
    tdee
  };

  // Save profile to localStorage linked to user
  const userProfile = {
    ...input,
    ...result
  };
  localStorage.setItem(PROFILE_KEY_PREFIX + userId, JSON.stringify(userProfile));

  // Update has_surveyed flag in current session
  updateCurrentUserSurveyStatus(true);

  return result;
};

export const getCustomerProfile = (userId: string) => {
  const profile = localStorage.getItem(PROFILE_KEY_PREFIX + userId);
  if (!profile) {
    // Default fallback profile
    return {
      health_goal: 'Weight Loss',
      gender: 'Male',
      age: 25,
      height: 175,
      weight: 68,
      activity_level: 'Moderately Active',
      diet_preference: 'Bình thường',
      allergyIds: [],
      profileId: 'profile_default',
      target_calories: 1850,
      target_protein: 145,
      bmi: 22.2,
      tdee: 2150
    };
  }
  return JSON.parse(profile);
};
