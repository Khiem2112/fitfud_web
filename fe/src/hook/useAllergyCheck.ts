import { useQuery } from '@tanstack/react-query';
import { getCustomerProfile } from '../service/surveyService';
import { mockMasterData } from '../service/menuService';

const checkAllergiesAsync = async (userId: string, dishIngredients: string[]) => {
  // Simulate network delay for API emulation
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const profile = getCustomerProfile(userId);
  if (!profile || !profile.allergyIds || profile.allergyIds.length === 0) return null;

  const userAllergyNames = mockMasterData.allergies
    .filter((a) => profile.allergyIds.includes(a.id))
    .map((a) => a.name);

  const allergenMap: Record<string, string[]> = {
    'Cá': ['cá', 'cá hồi', 'cá ngừ'],
    'Trứng': ['trứng'],
    'Gluten': ['gạo lứt', 'mì ý', 'lúa mì', 'bột mì'],
    'Lạc': ['đậu phộng', 'lạc'],
    'Sữa': ['bơ', 'sữa', 'phô mai', 'bơ lạt'],
    'Hạt': ['óc chó', 'hướng dương', 'hạt dẻ', 'điều'],
    'Đậu nành': ['đậu nành', 'đậu hũ', 'tào phớ']
  };

  const matchedAllergens: { allergyName: string; clashingIngredient: string }[] = [];
  
  userAllergyNames.forEach((allergyName) => {
    const triggers = allergenMap[allergyName] || [allergyName.toLowerCase()];
    const clashingIngredient = dishIngredients.find((ing) =>
      triggers.some((trig) => ing.toLowerCase().includes(trig))
    );
    if (clashingIngredient) {
      matchedAllergens.push({ allergyName, clashingIngredient });
    }
  });

  return matchedAllergens.length > 0 ? matchedAllergens : null;
};

export const useAllergyCheck = (userId: string | undefined, dishIngredients: string[] | undefined) => {
  return useQuery({
    queryKey: ['allergyCheck', userId, dishIngredients],
    queryFn: () => checkAllergiesAsync(userId!, dishIngredients!),
    enabled: !!userId && !!dishIngredients && dishIngredients.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
