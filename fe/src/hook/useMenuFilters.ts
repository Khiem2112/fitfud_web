import { useMemo } from 'react';
import { useMenuFilterStore } from '../store/menuFilterStore';
import { useDebounce } from './useDebounce';
import { FilterMenuInput } from '../type/menu.types';

export const useMenuFilters = () => {
  const store = useMenuFilterStore();

  // Create an object of just the filter values to debounce them together
  const filterValues = useMemo(() => ({
    search: store.search,
    categories: store.categories,
    diets: store.diets,
    allergiesExclude: store.allergiesExclude,
    minCal: store.minCal === '' ? undefined : Number(store.minCal),
    maxCal: store.maxCal === '' ? undefined : Number(store.maxCal),
    minPrice: store.minPrice === '' ? undefined : Number(store.minPrice),
    maxPrice: store.maxPrice === '' ? undefined : Number(store.maxPrice),
    inStockOnly: store.inStockOnly,
  }), [
    store.search,
    store.categories,
    store.diets,
    store.allergiesExclude,
    store.minCal,
    store.maxCal,
    store.minPrice,
    store.maxPrice,
    store.inStockOnly,
  ]);

  const debouncedFilters = useDebounce(filterValues, 500);

  // Expose store state and setters, plus the debounced filter payload
  return {
    // State
    search: store.search,
    categories: store.categories,
    diets: store.diets,
    allergiesExclude: store.allergiesExclude,
    minCal: store.minCal,
    maxCal: store.maxCal,
    minPrice: store.minPrice,
    maxPrice: store.maxPrice,
    inStockOnly: store.inStockOnly,

    // Setters
    setSearch: store.setSearch,
    toggleCategory: store.toggleCategory,
    toggleDiet: store.toggleDiet,
    toggleAllergy: store.toggleAllergy,
    setMinCal: store.setMinCal,
    setMaxCal: store.setMaxCal,
    setMinPrice: store.setMinPrice,
    setMaxPrice: store.setMaxPrice,
    setInStockOnly: store.setInStockOnly,
    clearAll: store.clearAll,

    // Debounced values for API fetching
    debouncedFilters,
  };
};
