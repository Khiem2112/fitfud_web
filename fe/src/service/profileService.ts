import { MealLogInput, MealLogOutput, ProfileDashboardOutput } from '../type/profile.types';
import { getCustomerProfile } from './surveyService';

const MEAL_LOGS_KEY_PREFIX = 'fitfud_meal_logs_';

export const getMealLogs = (userId: string): MealLogOutput[] => {
  const stored = localStorage.getItem(MEAL_LOGS_KEY_PREFIX + userId);
  if (!stored) {
    // Default initial mock meals
    const initialLogs: MealLogOutput[] = [
      {
        id: 'ml_1',
        dish_name: 'Salad gà áp chảo',
        calories: 450,
        protein: 35,
        fat: 14,
        carb: 28,
        logged_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hrs ago
      }
    ];
    localStorage.setItem(MEAL_LOGS_KEY_PREFIX + userId, JSON.stringify(initialLogs));
    return initialLogs;
  }
  return JSON.parse(stored);
};

export const logMeal = async (userId: string, input: MealLogInput): Promise<MealLogOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const logs = getMealLogs(userId);
  const newLog: MealLogOutput = {
    ...input,
    id: 'ml_' + Date.now(),
    logged_at: new Date().toISOString()
  };

  logs.unshift(newLog);
  localStorage.setItem(MEAL_LOGS_KEY_PREFIX + userId, JSON.stringify(logs));

  return newLog;
};

export const getProfileDashboard = async (userId: string, fullName: string): Promise<ProfileDashboardOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const profile = getCustomerProfile(userId);
  const logs = getMealLogs(userId);

  // Sum calories/protein logged today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let todayCal = 0;
  let todayPro = 0;

  logs.forEach((log) => {
    const logDate = new Date(log.logged_at);
    if (logDate >= startOfToday) {
      todayCal += log.calories;
      todayPro += log.protein;
    }
  });

  // Mock weekly trends
  const weekly_trend = [
    { day: 'T2', calories: 1550, protein: 120 },
    { day: 'T3', calories: 1800, protein: 130 },
    { day: 'T4', calories: 1450, protein: 110 },
    { day: 'T5', calories: 1650, protein: 125 },
    { day: 'T6', calories: 1750, protein: 138 },
    { day: 'T7', calories: 1900, protein: 140 },
    { day: 'CN', calories: todayCal || 1250, protein: todayPro || 90 }
  ];

  return {
    fullName: fullName,
    weight: profile.weight,
    height: profile.height,
    bmi: profile.bmi,
    tdee: profile.tdee,
    target_calories: profile.target_calories,
    target_protein: profile.target_protein,
    today_calories_logged: todayCal || 1250, // Fallback to figma default if empty
    today_protein_logged: todayPro || 90,
    weekly_trend
  };
};

export const analyzeMealImage = async (imageFile: File): Promise<MealLogInput> => {
  // Simulate AI delay for photo scan
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock AI image identification output
  const mockPredictions = [
    { dish_name: 'Bowl Ngũ Cốc Cầu Vồng', calories: 320, protein: 16, fat: 8, carb: 42 },
    { dish_name: 'Cơm Cá Hồi Áp Chảo', calories: 542, protein: 35, fat: 19, carb: 48 },
    { dish_name: 'Salad Gà Bơ', calories: 310, protein: 22, fat: 15, carb: 12 }
  ];

  // Pick a random prediction
  const randomIndex = Math.floor(Math.random() * mockPredictions.length);
  return mockPredictions[randomIndex];
};
