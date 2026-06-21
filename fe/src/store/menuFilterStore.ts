import { create } from 'zustand';

export interface MenuFilterState {
  search: string;
  categories: string[];
  diets: string[];
  allergiesExclude: string[];
  minCal: number | '';
  maxCal: number | '';
  minPrice: number | '';
  maxPrice: number | '';
  inStockOnly: boolean;

  setSearch: (search: string) => void;
  toggleCategory: (category: string) => void;
  toggleDiet: (diet: string) => void;
  toggleAllergy: (allergy: string) => void;
  setMinCal: (val: number | '') => void;
  setMaxCal: (val: number | '') => void;
  setMinPrice: (val: number | '') => void;
  setMaxPrice: (val: number | '') => void;
  setInStockOnly: (val: boolean) => void;
  clearAll: () => void;
}

const initialState = {
  search: '',
  categories: [],
  diets: [],
  allergiesExclude: [],
  minCal: '' as const,
  maxCal: '' as const,
  minPrice: '' as const,
  maxPrice: '' as const,
  inStockOnly: true,
};

export const useMenuFilterStore = create<MenuFilterState>((set) => ({
  ...initialState,
  
  setSearch: (search) => set({ search }),
  toggleCategory: (catName) =>
    set((state) => ({
      categories: state.categories.includes(catName)
        ? state.categories.filter((c) => c !== catName)
        : [...state.categories, catName],
    })),
  toggleDiet: (dietName) =>
    set((state) => ({
      diets: state.diets.includes(dietName)
        ? state.diets.filter((d) => d !== dietName)
        : [...state.diets, dietName],
    })),
  toggleAllergy: (allergyName) =>
    set((state) => ({
      allergiesExclude: state.allergiesExclude.includes(allergyName)
        ? state.allergiesExclude.filter((a) => a !== allergyName)
        : [...state.allergiesExclude, allergyName],
    })),
  setMinCal: (minCal) => set({ minCal }),
  setMaxCal: (maxCal) => set({ maxCal }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  clearAll: () => set(initialState),
}));
