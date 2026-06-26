export type DishSizeInfo = {
  id: string;
  size_name: string; // S, M, L
  price: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

export type ReviewItem = {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
};

export type DishItem = {
  id: string;
  dish_name: string;
  description?: string;
  image_url?: string;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  category_name: string;
  diet_tags: string[];
  ingredients: string[];
  sizes: DishSizeInfo[];
  rating_avg: number;
  reviews_count: number;
  reviews: ReviewItem[];
};

export type FilterMenuInput = {
  search?: string;
  categories?: string[];
  diets?: string[];
  allergiesExclude?: string[];
  minCal?: number;
  maxCal?: number;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  page: number;
  limit: number;
};

export type FilterMenuOutput = {
  dishes: DishItem[];
  totalItems: number;
  totalPages: number;
};

export type FilterMasterDataOutput = {
  categories: { id: string; name: string }[];
  diets: { id: string; name: string }[];
  allergies: { id: string; name: string; triggers: string[] }[];
};
