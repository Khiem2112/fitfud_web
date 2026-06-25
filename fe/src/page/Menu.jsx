import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchHealthyMenu, mockMasterData } from '../service/menuService';
import { getCustomerProfile } from '../service/surveyService';
import { useMenuFilters } from '../hook/useMenuFilters';

import SidebarFilter from '../component/organism/Menu/SidebarFilter';
import DishGrid from '../component/organism/Menu/DishGrid';
import QuickViewModal from '../component/organism/Menu/QuickViewModal';

export default function Menu() {
  const { user, addToCart } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL pagination state
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const setPage = (newPage) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };

  const { debouncedFilters, clearAll } = useMenuFilters();

  // Reset page to 1 whenever debounced filters change
  useEffect(() => {
    if (page !== 1) {
      setSearchParams((prev) => {
        prev.set('page', '1');
        return prev;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]); // Only react to filter changes

  // Active filters applied to query
  const appliedFilters = {
    ...debouncedFilters,
    page,
    limit: 18,
  };

  // Tanstack Query for menu list
  const { data: menuData, isLoading, isError } = useQuery({
    queryKey: ['healthyMenu', appliedFilters],
    queryFn: () => fetchHealthyMenu(appliedFilters),
    keepPreviousData: true
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
      // Map allergy IDs to names
      const userAllergyNames = mockMasterData.allergies
        .filter((a) => profile.allergyIds.includes(a.id))
        .map((a) => a.name);

      // Simple keyword matching helper
      const allergenMap = {
        'Cá': ['cá', 'cá hồi', 'cá ngừ'],
        'Trứng': ['trứng'],
        'Gluten': ['gạo lứt', 'mì ý', 'lúa mì', 'bột mì'],
        'Lạc': ['đậu phộng', 'lạc'],
        'Sữa': ['bơ', 'sữa', 'phô mai', 'bơ lạt'],
        'Hạt': ['óc chó', 'hướng dương', 'hạt dẻ', 'điều'],
        'Đậu nành': ['đậu nành', 'đậu hũ', 'tào phớ']
      };

      const matchedAllergens = [];
      userAllergyNames.forEach((allergyName) => {
        const triggers = allergenMap[allergyName] || [allergyName.toLowerCase()];
        const clashingIngredient = dish.ingredients.find((ing) =>
          triggers.some((trig) => ing.toLowerCase().includes(trig))
        );
        if (clashingIngredient) {
          matchedAllergens.push({ allergyName, clashingIngredient });
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
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-5 lg:px-6 page-enter">
      {/* Grid container with sidebar and content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* SIDEBAR FILTER (Left) */}
        <SidebarFilter />

        {/* FOOD LIST SECTION (Right) */}
        <DishGrid
          isLoading={isLoading}
          isError={isError}
          menuData={menuData}
          page={page}
          setPage={setPage}
          onOpenQuickView={handleOpenQuickView}
          onClearAllFilters={handleClearAllFilters}
        />
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
