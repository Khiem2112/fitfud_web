import { useQuery } from '@tanstack/react-query';
import { getCustomerProfile } from '../service/surveyService';
import { mockMasterData } from '../service/menuService';

const checkAllergiesAsync = async (userId: string, dishIngredients: string[]) => {
  // Simulate network delay for API emulation
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const profile = getCustomerProfile(userId);
  if (!profile || !profile.allergyIds || profile.allergyIds.length === 0) return null;

  const userAllergies = mockMasterData.allergies.filter((a) => profile.allergyIds.includes(a.id));

  const matchedAllergens: { allergyName: string; clashingIngredient: string }[] = [];
  
  userAllergies.forEach((allergy) => {
    const triggers = allergy.triggers || [allergy.name.toLowerCase()];
    const clashingIngredient = dishIngredients.find((ing) =>
      triggers.some((trig) => ing.toLowerCase().includes(trig.toLowerCase()))
    );
    if (clashingIngredient) {
      matchedAllergens.push({ allergyName: allergy.name, clashingIngredient });
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
