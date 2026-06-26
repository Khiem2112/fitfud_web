import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { fetchHomePage } from '../service/homeService';
import { mockMasterData } from '../service/menuService';
import { getCustomerProfile } from '../service/surveyService';

import HeroSection from '../component/organism/Home/HeroSection';
import FeaturedSection from '../component/organism/Home/FeaturedSection';
import QuickLinksSection from '../component/organism/Home/QuickLinksSection';
import QuickViewModal from '../component/organism/Menu/QuickViewModal';

export default function Home() {
  const { user, addToCart } = useApp();

  // Fetch home page data
  const { data, isLoading } = useQuery({
    queryKey: ['homePage'],
    queryFn: fetchHomePage,
  });

  // Quick View Popup States
  const [selectedDish, setSelectedDish] = useState(null);
  const [allergenAlert, setAllergenAlert] = useState(null);

  // Customer Profile for Allergen Matches
  const profile = user ? getCustomerProfile(user.id) : null;

  const handleOpenQuickView = (dish) => {
    setSelectedDish(dish);

    if (profile && profile.allergyIds && profile.allergyIds.length > 0) {
      const userAllergies = mockMasterData.allergies.filter((a) => profile.allergyIds.includes(a.id));

      const matchedAllergens = [];
      userAllergies.forEach((allergy) => {
        const triggers = allergy.triggers || [allergy.name.toLowerCase()];
        const clashingIngredient = dish.ingredients.find((ing) =>
          triggers.some((trig) => ing.toLowerCase().includes(trig.toLowerCase()))
        );
        if (clashingIngredient) {
          matchedAllergens.push({ allergyName: allergy.name, clashingIngredient });
        }
      });

      if (matchedAllergens.length > 0) {
        setAllergenAlert(matchedAllergens);
      } else {
        setAllergenAlert(null);
      }
    } else {
      setAllergenAlert(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full page-enter">
      <HeroSection />
      
      {!isLoading && data?.featuredDishes && (
        <FeaturedSection 
          dishes={data.featuredDishes} 
          onOpenQuickView={handleOpenQuickView} 
        />
      )}
      
      <QuickLinksSection />

      {/* QUICK VIEW POPUP MODAL */}
      {selectedDish && (
        <QuickViewModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
          allergenAlert={allergenAlert}
        />
      )}
    </div>
  );
}
