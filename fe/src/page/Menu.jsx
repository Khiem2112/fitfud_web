import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchHealthyMenu, mockMasterData } from '../service/menuService';
import { getCustomerProfile } from '../service/surveyService';
import { useMenuFilters } from '../hook/useMenuFilters';

import SidebarFilter from '../component/organism/Menu/SidebarFilter';
import DishGrid from '../component/organism/Menu/DishGrid';
import QuickViewModal from '../component/organism/Menu/QuickViewModal';
import InfiniteScrollLoader from '../component/molecule/Menu/InfiniteScrollLoader';

export default function Menu() {
  const { user, addToCart } = useApp();
  const { debouncedFilters, clearAll } = useMenuFilters();

  // Active filters applied to query
  const appliedFilters = {
    ...debouncedFilters,
    limit: 18,
  };

  // Tanstack Query for infinite menu list
  const { 
    data: menuData, 
    isLoading, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['healthyMenu', appliedFilters],
    queryFn: ({ pageParam = 1 }) => fetchHealthyMenu({ ...appliedFilters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // Customer Profile for Allergen Matches
  const profile = user ? getCustomerProfile(user.id) : null;

  // Quick View Popup States
  const [selectedDish, setSelectedDish] = useState(null);
  const [allergenAlert, setAllergenAlert] = useState(null);

  // Triggered when a dish card or "Thêm vào giỏ" is clicked
  const handleOpenQuickView = (dish) => {
    setSelectedDish(dish);

    // Allergen detection: check if dish ingredients clash with user profile allergies
    if (profile && profile.allergyIds && profile.allergyIds.length > 0) {
      // Map allergy IDs to allergy objects
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

  const handleClearAllFilters = () => {
    clearAll();
  };

  const allDishes = menuData?.pages?.flatMap(p => p.dishes) || [];
  const totalItems = menuData?.pages?.[0]?.totalItems || 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-5 lg:px-6 page-enter">
      {/* Grid container with sidebar and content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* SIDEBAR FILTER (Left) */}
        <SidebarFilter />

        {/* FOOD LIST SECTION (Right) */}
        <div className="lg:col-span-4 flex flex-col">
          <DishGrid
            isLoading={isLoading}
            isError={isError}
            dishes={allDishes}
            totalItems={totalItems}
            onOpenQuickView={handleOpenQuickView}
            onClearAllFilters={handleClearAllFilters}
          />
          
          <InfiniteScrollLoader 
            fetchNextPage={fetchNextPage} 
            hasNextPage={hasNextPage} 
            isFetchingNextPage={isFetchingNextPage} 
          />
        </div>
      </div>

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
