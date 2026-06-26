import { DishItem, FilterMasterDataOutput, FilterMenuInput, FilterMenuOutput } from '../type/menu.types';
import { categories } from '../seed/categories';
import { diets } from '../seed/diets';
import { allergies } from '../seed/allergies';
import { mockDishes as originalMockDishes } from '../seed/dishes';

// Duplicate to have enough items for infinite scroll testing
const mockDishes: DishItem[] = [
  ...originalMockDishes,
  ...originalMockDishes.map(d => ({ ...d, id: d.id + '_c1', dish_name: d.dish_name + ' (1)' })),
  ...originalMockDishes.map(d => ({ ...d, id: d.id + '_c2', dish_name: d.dish_name + ' (2)' })),
  ...originalMockDishes.map(d => ({ ...d, id: d.id + '_c3', dish_name: d.dish_name + ' (3)' })),
  ...originalMockDishes.map(d => ({ ...d, id: d.id + '_c4', dish_name: d.dish_name + ' (4)' }))
];

// Mock Master Data
export const mockMasterData: FilterMasterDataOutput = {
  categories,
  diets,
  allergies
};

export const fetchFilterOptions = async (): Promise<FilterMasterDataOutput> => {
  return mockMasterData;
};

// Helper function to attach user reviews from localStorage to a dish and recalculate rating_avg & reviews_count
const attachReviewsToDish = (dish: DishItem): DishItem => {
  try {
    const storedReviews = localStorage.getItem('fitfud_reviews');
    if (!storedReviews) {
      const count = dish.reviews?.length || 0;
      const avg = count > 0 ? Number((dish.reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)) : dish.rating_avg;
      return { ...dish, reviews_count: count, rating_avg: avg };
    }

    const allStoredReviews = JSON.parse(storedReviews);
    // Find all reviews matching the base dish ID (remove _c1, _c2 etc if infinite scroll clones exist)
    const baseDishId = dish.id.split('_c')[0]; 
    const dishUserReviews = allStoredReviews.filter((r: any) => r.dishId === baseDishId).map((r: any) => ({
      id: r.id,
      reviewer_name: 'Bạn', // Simplified
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt.split('T')[0]
    }));

    const combinedReviews = [...dishUserReviews, ...(dish.reviews || [])];
    const reviewsCount = combinedReviews.length;
    const ratingAvg = reviewsCount > 0 
      ? Number((combinedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1)) 
      : dish.rating_avg;

    return {
      ...dish,
      reviews: combinedReviews,
      reviews_count: reviewsCount,
      rating_avg: ratingAvg
    };
  } catch (err) {
    return dish; // Fallback
  }
};

export const fetchHealthyMenu = async (input: FilterMenuInput): Promise<FilterMenuOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...mockDishes];

  // 1. Search Query
  if (input.search && input.search.trim()) {
    const q = input.search.toLowerCase().trim();
    filtered = filtered.filter(
      (d) =>
        d.dish_name.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }

  // 2. Filter Category
  if (input.categories && input.categories.length > 0) {
    filtered = filtered.filter((d) => input.categories!.includes(d.category_name));
  }

  // 3. Filter Diet Tags
  if (input.diets && input.diets.length > 0) {
    filtered = filtered.filter((d) => d.diet_tags.some((tag) => input.diets!.includes(tag)));
  }

  // 4. Exclude Allergies
  if (input.allergiesExclude && input.allergiesExclude.length > 0) {
    const excludedTriggers: string[] = [];
    input.allergiesExclude.forEach((allergyName) => {
      const allergy = mockMasterData.allergies.find((a) => a.name === allergyName);
      if (allergy && allergy.triggers) {
        excludedTriggers.push(...allergy.triggers);
      }
    });

    if (excludedTriggers.length > 0) {
      filtered = filtered.filter(
        (d) => !d.ingredients.some((ing) => 
          excludedTriggers.some((trigger) => ing.toLowerCase().includes(trigger.toLowerCase()))
        )
      );
    }
  }

  // 5. Filter Calo range (for medium size)
  if (input.minCal !== undefined || input.maxCal !== undefined) {
    filtered = filtered.filter((d) => {
      const medSize = d.sizes.find((s) => s.size_name === 'M') || d.sizes[0];
      const cal = medSize.calories;
      const minOk = input.minCal === undefined || cal >= input.minCal;
      const maxOk = input.maxCal === undefined || cal <= input.maxCal;
      return minOk && maxOk;
    });
  }

  // 6. Filter Price range
  if (input.minPrice !== undefined || input.maxPrice !== undefined) {
    filtered = filtered.filter((d) => {
      const medSize = d.sizes.find((s) => s.size_name === 'M') || d.sizes[0];
      const pr = medSize.price;
      const minOk = input.minPrice === undefined || pr >= input.minPrice;
      const maxOk = input.maxPrice === undefined || pr <= input.maxPrice;
      return minOk && maxOk;
    });
  }

  // 7. Toggle "In Stock Only"
  if (input.inStockOnly) {
    filtered = filtered.filter((d) => d.status === 'Active');
  }

  // 8. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / input.limit);
  const startIdx = (input.page - 1) * input.limit;
  const paginatedDishes = filtered.slice(startIdx, startIdx + input.limit).map(attachReviewsToDish);

  return {
    dishes: paginatedDishes,
    totalItems,
    totalPages
  };
};

export const fetchDishDetail = async (id: string): Promise<DishItem> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const dish = mockDishes.find((d) => d.id === id);
  if (!dish) {
    throw new Error('Không tìm thấy món ăn này!');
  }
  return attachReviewsToDish(dish);
};
