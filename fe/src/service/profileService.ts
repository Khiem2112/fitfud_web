import { MealLogInput, MealLogOutput, ProfileDashboardOutput, UpdateProfileHealthInput, UpdateProfileHealthOutput, SearchFitFudDishForLogOutput, ChangePasswordInput } from '../type/profile.types';
import { getCustomerProfile } from './surveyService';
import { getSavedAddresses } from './checkoutService';

const MEAL_LOGS_KEY_PREFIX = 'fitfud_meal_logs_';

export const getMealLogs = (userId: string): MealLogOutput[] => {
  const stored = localStorage.getItem(MEAL_LOGS_KEY_PREFIX + userId);
  if (!stored) {
    const initialLogs: MealLogOutput[] = [
      {
        id: 'ml_1',
        dish_name: 'Salad gà áp chảo',
        calories: 450,
        protein: 35,
        fat: 14,
        carb: 28,
        logged_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: 'FitFudDish'
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

  const weekly_trend = [
    { day: 'T2', calories: 1550, protein: 120 },
    { day: 'T3', calories: 1800, protein: 130 },
    { day: 'T4', calories: 1450, protein: 110 },
    { day: 'T5', calories: 1650, protein: 125 },
    { day: 'T6', calories: 1750, protein: 138 },
    { day: 'T7', calories: 1900, protein: 140 },
    { day: 'CN', calories: todayCal || 1250, protein: todayPro || 90 }
  ];

  const addresses = await getSavedAddresses(userId);
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  const mappedAddress = defaultAddress ? {
    id: defaultAddress.id,
    receiver_name: defaultAddress.name,
    receiver_phone: defaultAddress.phone,
    full_address: `${defaultAddress.shipping_address_text}, ${defaultAddress.wardName}, ${defaultAddress.districtName}, ${defaultAddress.cityName}`
  } : undefined;

  const aiRecommendedDishes: ProfileDashboardOutput['aiRecommendedDishes'] = [
    {
      id: 'ai_1',
      dish_name: 'Gà Teriyaki & Cơm Lứt',
      reason: 'Giàu protein, phù hợp mục tiêu tăng cơ',
      price_from: 65000,
      calories: 450,
      protein: 38,
      status: 'Active'
    },
    {
      id: 'ai_2',
      dish_name: 'Salad Tôm Bơ',
      reason: 'Ít calo, giàu chất béo tốt',
      price_from: 75000,
      calories: 320,
      protein: 25,
      status: 'Active'
    }
  ];

  return {
    fullName: fullName,
    weight: profile.weight,
    height: profile.height,
    bmi: profile.bmi,
    tdee: profile.tdee,
    health_goal: profile.health_goal || 'Giảm cân',
    target_calories: profile.target_calories,
    target_protein: profile.target_protein,
    today_calories_logged: todayCal || 1250,
    today_protein_logged: todayPro || 90,
    weekly_trend,
    defaultAddress: mappedAddress,
    aiRecommendedDishes,
    recentMeals: logs.slice(0, 3)
  };
};

export const updateProfileHealth = async (userId: string, input: UpdateProfileHealthInput): Promise<UpdateProfileHealthOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const profile = getCustomerProfile(userId);
  
  const updatedWeight = input.weight || profile.weight;
  const updatedHeight = input.height || profile.height;
  
  const heightM = updatedHeight / 100;
  const bmi = Number((updatedWeight / (heightM * heightM)).toFixed(1));
  
  return {
    success: true,
    bmi: bmi,
    tdee: profile.tdee,
    target_calories: profile.target_calories,
    target_protein: profile.target_protein
  };
};

export const analyzeMealImage = async (imageFile: File): Promise<Omit<MealLogInput, 'source'>> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockPredictions = [
    { dish_name: 'Bowl Ngũ Cốc Cầu Vồng', calories: 320, protein: 16, fat: 8, carb: 42 },
    { dish_name: 'Cơm Cá Hồi Áp Chảo', calories: 542, protein: 35, fat: 19, carb: 48 },
    { dish_name: 'Salad Gà Bơ', calories: 310, protein: 22, fat: 15, carb: 12 }
  ];

  const randomIndex = Math.floor(Math.random() * mockPredictions.length);
  return mockPredictions[randomIndex];
};

export const searchFitFudDishForLog = async (keyword: string): Promise<SearchFitFudDishForLogOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const allDishes = [
    { id: 'dish_1', dish_name: 'Cơm cá hồi áp chảo', calories: 542, protein: 35, carb: 48, fat: 19 },
    { id: 'dish_2', dish_name: 'Cơm gà gạo lứt', calories: 420, protein: 32, carb: 45, fat: 12 },
    { id: 'dish_3', dish_name: 'Bò áp chảo khoai lang', calories: 480, protein: 35, carb: 40, fat: 15 },
    { id: 'dish_5', dish_name: 'Salmon Poke Bowl', calories: 450, protein: 28, carb: 35, fat: 18 },
    { id: 'dish_6', dish_name: 'Buddha Veggie Bowl', calories: 380, protein: 16, carb: 50, fat: 10 },
    { id: 'dish_7', dish_name: 'Nước ép xanh thanh lọc', calories: 120, protein: 3, carb: 25, fat: 0 }
  ];

  if (!keyword) return { dishes: allDishes };
  
  const filtered = allDishes.filter(d => d.dish_name.toLowerCase().includes(keyword.toLowerCase()));
  return { dishes: filtered };
};

export const changePassword = async (input: ChangePasswordInput): Promise<{success: boolean, message: string}> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (input.current_password !== '123456') { // Mock check
    throw new Error('Mật khẩu hiện tại không chính xác');
  }
  
  return {
    success: true,
    message: 'Đổi mật khẩu thành công'
  };
};
