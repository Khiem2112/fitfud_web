import { fetchHealthyMenu } from './menuService';
import { DishItem } from '../type/menu.types';

export type HomePageOutput = {
  featuredDishes: DishItem[];
};

export const fetchHomePage = async (): Promise<HomePageOutput> => {
  // Fetch a list of featured dishes. 
  // We mock this by fetching from the menu service with a limit.
  const menu = await fetchHealthyMenu({
    page: 1,
    limit: 3,
    inStockOnly: true,
  });

  return {
    featuredDishes: menu.dishes,
  };
};
