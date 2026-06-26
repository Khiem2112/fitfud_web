import { MealLogInput, MealLogOutput, ProfileDashboardOutput, UpdateProfileHealthInput, UpdateProfileHealthOutput, SearchFitFudDishForLogOutput, ChangePasswordInput } from '../type/profile.types';
import { getCustomerProfile } from './surveyService';
import { getSavedAddresses } from './checkoutService';
import { fetchHealthyMenu } from './menuService';

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
    { day: 'T2', calories: 2100, protein: 110 },
    { day: 'T3', calories: 1950, protein: 95 },
    { day: 'T4', calories: 2200, protein: 120 },
    { day: 'T5', calories: 1800, protein: 85 },
    { day: 'T6', calories: 2350, protein: 130 },
    { day: 'T7', calories: 1700, protein: 80 },
    { day: 'CN', calories: todayCal || 2150, protein: todayPro || 115 }
  ];

  const addresses = await getSavedAddresses(userId);
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  const mappedAddress = defaultAddress ? {
    id: defaultAddress.id,
    receiver_name: defaultAddress.name,
    receiver_phone: defaultAddress.phone,
    full_address: `${defaultAddress.shipping_address_text}, ${defaultAddress.wardName}, ${defaultAddress.districtName}, ${defaultAddress.cityName}`
  } : undefined;

  const mappedAddresses = addresses.map(addr => ({
    id: addr.id,
    receiver_name: addr.name,
    receiver_phone: addr.phone,
    full_address: `${addr.shipping_address_text}, ${addr.wardName}, ${addr.districtName}, ${addr.cityName}`
  }));

  // Lấy món ăn bất kỳ từ menu
  const { dishes } = await fetchHealthyMenu({ limit: 10, page: 1, inStockOnly: false });
  const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
  const randomSize = randomDish.sizes.find(s => s.size_name === 'M') || randomDish.sizes[0];

  const aiRecommendedDishes: ProfileDashboardOutput['aiRecommendedDishes'] = [
    {
      id: 'ai_' + randomDish.id,
      dish_name: randomDish.dish_name,
      reason: 'Dựa trên phân tích thói quen ăn uống và mục tiêu sức khỏe hiện tại của bạn, AI của FitFud đề xuất món ăn này giúp bổ sung lượng protein cần thiết mà vẫn duy trì mức calo hợp lý. Món ăn chứa đầy đủ dưỡng chất và hương vị thơm ngon giúp bạn có một bữa ăn hoàn hảo!',
      price_from: randomSize.price,
      calories: randomSize.calories,
      protein: randomSize.protein,
      status: randomDish.status as 'Active' | 'Inactive' | 'Out of Stock',
      image_url: randomDish.image_url,
      originalDish: randomDish
    }
  ];

  return {
    fullName: fullName,
    weight: profile.weight,
    height: profile.height,
    bmi: profile.bmi,
    tdee: profile.tdee,
    health_goal: profile.health_goal || 'Weight Loss',
    activity_level: profile.activity_level || 'Moderately Active',
    diet_preference: profile.diet_preference || 'Bình thường',
    target_calories: profile.target_calories,
    target_protein: profile.target_protein,
    today_calories_logged: todayCal || 1250,
    today_protein_logged: todayPro || 90,
    weekly_trend,
    defaultAddress: mappedAddress,
    addresses: mappedAddresses,
    aiRecommendedDishes,
    recentMeals: logs.filter((log) => new Date(log.logged_at) >= startOfToday)
  };
};

export const updateProfileHealth = async (userId: string, input: UpdateProfileHealthInput): Promise<UpdateProfileHealthOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const profile = getCustomerProfile(userId);

  const updatedWeight = input.weight || profile.weight;
  const updatedHeight = input.height || profile.height;
  const updatedGoal = input.health_goal || profile.health_goal;
  const updatedActivity = input.activity_level || profile.activity_level;
  const updatedDiet = input.diet_preference || profile.diet_preference;

  const heightM = updatedHeight / 100;
  const bmi = Number((updatedWeight / (heightM * heightM)).toFixed(1));

  let bmr = 0;
  if (profile.gender === 'Male') {
    bmr = 88.362 + 13.397 * updatedWeight + 4.799 * updatedHeight - 5.677 * profile.age;
  } else if (profile.gender === 'Female') {
    bmr = 447.593 + 9.247 * updatedWeight + 3.098 * updatedHeight - 4.330 * profile.age;
  } else {
    bmr = 260 + 11.3 * updatedWeight + 4.0 * updatedHeight - 5.0 * profile.age;
  }

  let multiplier = 1.2;
  switch (updatedActivity) {
    case 'Sedentary': multiplier = 1.2; break;
    case 'Lightly Active': multiplier = 1.375; break;
    case 'Moderately Active': multiplier = 1.55; break;
    case 'Very Active': multiplier = 1.725; break;
    case 'Extra Active': multiplier = 1.9; break;
  }
  const tdee = Math.round(bmr * multiplier);

  let target_calories = tdee;
  if (updatedGoal === 'Weight Loss') {
    target_calories = Math.max(1200, tdee - 500);
  } else if (updatedGoal === 'Muscle Gain') {
    target_calories = tdee + 300;
  }

  let proteinMultiplier = 1.5;
  if (updatedGoal === 'Muscle Gain' || updatedGoal === 'Weight Loss') {
    proteinMultiplier = 2.0;
  }
  const target_protein = Math.round(updatedWeight * proteinMultiplier);

  const updatedProfile = {
    ...profile,
    weight: updatedWeight,
    height: updatedHeight,
    health_goal: updatedGoal,
    activity_level: updatedActivity,
    diet_preference: updatedDiet,
    bmi,
    tdee,
    target_calories,
    target_protein
  };

  localStorage.setItem(`fitfud_profile_${userId}`, JSON.stringify(updatedProfile));

  return {
    success: true,
    bmi,
    tdee,
    target_calories,
    target_protein
  };
};

export const analyzeMealImage = async (imageFile: File): Promise<Omit<MealLogInput, 'source'>> => {
  await new Promise((resolve) => setTimeout(resolve, 12000));

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

export const changePassword = async (userId: string, input: ChangePasswordInput): Promise<{ success: boolean, message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const STORAGE_USERS_KEY = 'fitfud_mock_users';
  const usersStr = localStorage.getItem(STORAGE_USERS_KEY);
  if (!usersStr) throw new Error('Hệ thống chưa khởi tạo CSDL người dùng');

  const users = JSON.parse(usersStr);
  const index = users.findIndex((u: any) => u.id === userId);

  if (index === -1) {
    throw new Error('Không tìm thấy tài khoản người dùng');
  }

  if (users[index].password_hash !== input.current_password) {
    throw new Error('Mật khẩu hiện tại không chính xác');
  }

  users[index].password_hash = input.new_password;
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  return {
    success: true,
    message: 'Đổi mật khẩu thành công'
  };
};

export const getNutritionHistory = async (userId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const logs = getMealLogs(userId);
  const profile = getCustomerProfile(userId);

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
    { day: 'T2', calories: 2100, protein: 110 },
    { day: 'T3', calories: 1950, protein: 95 },
    { day: 'T4', calories: 2200, protein: 120 },
    { day: 'T5', calories: 1800, protein: 85 },
    { day: 'T6', calories: 2350, protein: 130 },
    { day: 'T7', calories: 1700, protein: 80 },
    { day: 'CN', calories: todayCal || 2150, protein: todayPro || 115 }
  ];

  return {
    weekly_trend,
    target_calories: profile.target_calories,
    target_protein: profile.target_protein,
    tdee: profile.tdee
  };
};
