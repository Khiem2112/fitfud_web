import { DishItem, FilterMasterDataOutput, FilterMenuInput, FilterMenuOutput } from '../type/menu.types';

// Mock Master Data
export const mockMasterData: FilterMasterDataOutput = {
  categories: [
    { id: 'cat_main', name: 'Món chính' },
    { id: 'cat_salad', name: 'Salad' },
    { id: 'cat_breakfast', name: 'Ăn sáng' },
    { id: 'cat_snack', name: 'Ăn nhẹ' },
    { id: 'cat_juice', name: 'Nước ép' }
  ],
  diets: [
    { id: 'diet_pro', name: 'Giàu Protein' },
    { id: 'diet_vegan', name: 'Thuần chay' },
    { id: 'diet_lowcarb', name: 'Low Carb' },
    { id: 'diet_keto', name: 'Keto Friendly' }
  ],
  allergies: [
    { id: 'allergy_fish', name: 'Cá' },
    { id: 'allergy_egg', name: 'Trứng' },
    { id: 'allergy_gluten', name: 'Gluten' },
    { id: 'allergy_peanut', name: 'Lạc' },
    { id: 'allergy_shellfish', name: 'Hải sản vỏ' },
    { id: 'allergy_soy', name: 'Đậu nành' },
    { id: 'allergy_nuts', name: 'Hạt' },
    { id: 'allergy_milk', name: 'Sữa' }
  ]
};

// Raw Mock Dishes (Matching Figma content)
const mockDishes: DishItem[] = [
  {
    id: 'dish_1',
    dish_name: 'Cơm cá hồi áp chảo',
    description: 'Bữa ăn giàu dinh dưỡng với phi lê cá hồi áp chảo giòn da, cơm gạo lứt huyết rồng dẻo thơm và rau xanh luộc tươi mát kèm sốt chanh đậm vị.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein', 'Low Carb'],
    ingredients: ['Cá hồi', 'Gạo lứt', 'Bông cải xanh', 'Cà rốt', 'Dầu ô liu', 'Sốt chanh'],
    rating_avg: 4.8,
    reviews_count: 126,
    sizes: [
      { id: 'sz_1_s', size_name: 'S', price: 84000, calories: 420, protein: 28, fat: 14, carb: 35 },
      { id: 'sz_1_m', size_name: 'M', price: 99000, calories: 542, protein: 35, fat: 19, carb: 48 },
      { id: 'sz_1_l', size_name: 'L', price: 114000, calories: 680, protein: 44, fat: 23, carb: 58 }
    ],
    reviews: [
      { id: 'rev_1', reviewer_name: 'Minh Anh', rating: 5, comment: 'Cá rất tươi, áp chảo vừa chín tới vẫn còn độ mọng. Sẽ tiếp tục ủng hộ FitFud.', date: '2026-06-25' },
      { id: 'rev_2', reviewer_name: 'Hoàng Nam', rating: 4, comment: 'Cơm gạo lứt dẻo, rau tươi. Nước sốt chanh đi kèm rất bắt vị. Giao hàng nhanh.', date: '2026-06-22' }
    ]
  },
  {
    id: 'dish_2',
    dish_name: 'Cơm gà gạo lứt',
    description: 'Ức gà hữu cơ áp chảo mềm mọng, kết hợp cùng cơm gạo lứt thảo mộc giàu xơ và rau quả hữu cơ luộc.',
    image_url: 'https://images.unsplash.com/photo-13764603-bf527356dc6bb7ac?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein', 'Low Carb'],
    ingredients: ['Ức gà', 'Gạo lứt', 'Đậu bắp', 'Cà rốt', 'Sốt tỏi đen'],
    rating_avg: 4.7,
    reviews_count: 85,
    sizes: [
      { id: 'sz_2_s', size_name: 'S', price: 65000, calories: 350, protein: 25, fat: 8, carb: 32 },
      { id: 'sz_2_m', size_name: 'M', price: 74000, calories: 420, protein: 32, fat: 10, carb: 40 },
      { id: 'sz_2_l', size_name: 'L', price: 89000, calories: 510, protein: 40, fat: 12, carb: 50 }
    ],
    reviews: [
      { id: 'rev_3', reviewer_name: 'Thu Trang', rating: 5, comment: 'Ăn ức gà không hề bị khô, sốt tỏi đen ngon đậm đà lắm nha!', date: '2026-06-28' }
    ]
  },
  {
    id: 'dish_3',
    dish_name: 'Bò áp chảo khoai lang',
    description: 'Thịt thăn bò Mỹ mềm mại áp chảo, ăn kèm khoai lang mật nướng lò và súp lơ trắng nghiền sốt tiêu đen.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein', 'Keto Friendly'],
    ingredients: ['Thịt bò thăn', 'Khoai lang', 'Măng tây', 'Sốt tiêu đen', 'Bơ lạt'],
    rating_avg: 4.9,
    reviews_count: 94,
    sizes: [
      { id: 'sz_3_s', size_name: 'S', price: 105000, calories: 410, protein: 29, fat: 16, carb: 22 },
      { id: 'sz_3_m', size_name: 'M', price: 115000, calories: 480, protein: 35, fat: 20, carb: 28 },
      { id: 'sz_3_l', size_name: 'L', price: 135000, calories: 590, protein: 45, fat: 25, carb: 36 }
    ],
    reviews: []
  },
  {
    id: 'dish_4',
    dish_name: 'Salad gà bơ',
    description: 'Ức gà nướng xé nhỏ giòn da kết hợp bơ sáp béo ngậy, các loại hạt dinh dưỡng và rau xanh giòn hữu cơ.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    status: 'Out of Stock',
    category_name: 'Salad',
    diet_tags: ['Low Carb', 'Keto Friendly'],
    ingredients: ['Ức gà', 'Quả bơ', 'Rau xà lách', 'Hạt óc chó', 'Trứng', 'Sốt mè rang'],
    rating_avg: 4.5,
    reviews_count: 42,
    sizes: [
      { id: 'sz_4_s', size_name: 'S', price: 55000, calories: 250, protein: 18, fat: 12, carb: 10 },
      { id: 'sz_4_m', size_name: 'M', price: 65000, calories: 310, protein: 22, fat: 15, carb: 12 },
      { id: 'sz_4_l', size_name: 'L', price: 80000, calories: 400, protein: 28, fat: 20, carb: 15 }
    ],
    reviews: []
  },
  {
    id: 'dish_5',
    dish_name: 'Salmon Poke Bowl',
    description: 'Món ăn truyền thống Hawaii tươi mát với cá hồi hồi sống Nauy cắt hạt lựu, quả bơ, dưa chuột và rong biển sốt tương mè.',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Salad',
    diet_tags: ['Giàu Protein', 'Keto Friendly', 'Low Carb'],
    ingredients: ['Cá hồi', 'Quả bơ', 'Đậu nành Nhật', 'Dưa leo', 'Mè', 'Rong biển', 'Sốt tương mè'],
    rating_avg: 4.8,
    reviews_count: 215,
    sizes: [
      { id: 'sz_5_s', size_name: 'S', price: 105000, calories: 360, protein: 22, fat: 14, carb: 18 },
      { id: 'sz_5_m', size_name: 'M', price: 125000, calories: 450, protein: 28, fat: 19, carb: 24 },
      { id: 'sz_5_l', size_name: 'L', price: 150000, calories: 580, protein: 36, fat: 24, carb: 32 }
    ],
    reviews: [
      { id: 'rev_4', reviewer_name: 'Khánh Linh', rating: 5, comment: 'Món tủ của mình! Ăn rất thanh mát và no lâu.', date: '2026-06-27' }
    ]
  },
  {
    id: 'dish_6',
    dish_name: 'Buddha Veggie Bowl',
    description: 'Thực đơn thuần chay bồi bổ cơ thể với đậu hũ áp chảo, khoai lang tím nướng, hạt quinoa và rau cải xoăn sốt hạt hướng dương.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Ăn sáng',
    diet_tags: ['Thuần chay', 'Low Carb'],
    ingredients: ['Đậu hũ', 'Khoai lang tím', 'Hạt diêm mạch', 'Cải xoăn', 'Hạt hướng dương', 'Sốt mè rang'],
    rating_avg: 4.6,
    reviews_count: 53,
    sizes: [
      { id: 'sz_6_s', size_name: 'S', price: 80000, calories: 290, protein: 12, fat: 8, carb: 36 },
      { id: 'sz_6_m', size_name: 'M', price: 95000, calories: 380, protein: 16, fat: 11, carb: 45 },
      { id: 'sz_6_l', size_name: 'L', price: 110000, calories: 460, protein: 20, fat: 14, carb: 55 }
    ],
    reviews: []
  },
  {
    id: 'dish_7',
    dish_name: 'Nước ép xanh thanh lọc',
    description: 'Nước ép nguyên chất 100% từ cần tây, dưa leo, táo xanh và cải kale giúp detox cơ thể, bổ sung vitamin.',
    image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Nước ép',
    diet_tags: ['Thuần chay', 'Low Carb'],
    ingredients: ['Cần tây', 'Dưa leo', 'Táo xanh', 'Cải xoăn', 'Chanh'],
    rating_avg: 4.5,
    reviews_count: 77,
    sizes: [
      { id: 'sz_7_s', size_name: 'S', price: 35000, calories: 80, protein: 2, fat: 0, carb: 14 },
      { id: 'sz_7_m', size_name: 'M', price: 45000, calories: 120, protein: 3, fat: 0, carb: 22 }
    ],
    reviews: []
  }
];

export const fetchFilterOptions = async (): Promise<FilterMasterDataOutput> => {
  return mockMasterData;
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
    // In our map: allergy names correspond to ingredients (e.g. 'Cá' matches 'Cá hồi')
    // Let's create an ingredient matching map for exclusions
    const allergenMap: Record<string, string[]> = {
      'Cá': ['Cá hồi'],
      'Trứng': ['Trứng'],
      'Gluten': ['Gạo lứt', 'Mì Ý'],
      'Lạc': ['Đậu phộng', 'Lạc'],
      'Sữa': ['Bơ lạt', 'Phô mai'],
      'Hạt': ['Hạt óc chó', 'Hạt hướng dương'],
      'Đậu nành': ['Đậu nành Nhật', 'Đậu hũ']
    };

    const excludedIngredients: string[] = [];
    input.allergiesExclude.forEach((allergyName) => {
      const ingredients = allergenMap[allergyName];
      if (ingredients) {
        excludedIngredients.push(...ingredients);
      }
    });

    if (excludedIngredients.length > 0) {
      filtered = filtered.filter(
        (d) => !d.ingredients.some((ing) => excludedIngredients.includes(ing))
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
  const paginatedDishes = filtered.slice(startIdx, startIdx + input.limit);

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
  return dish;
};
