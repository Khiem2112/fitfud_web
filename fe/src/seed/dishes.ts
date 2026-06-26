import { DishItem } from '../type/menu.types';

export const mockDishes: DishItem[] = [
  {
    id: 'dish_1',
    dish_name: 'Cơm cá hồi áp chảo',
    description: 'Bữa ăn giàu dinh dưỡng với phi lê cá hồi áp chảo giòn da, cơm gạo lứt huyết rồng dẻo thơm và rau xanh luộc tươi mát kèm sốt chanh đậm vị.',
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlHcrwne1XCLMtjoUM_bcqSrMWPZA9YcM3g7ah2uh9WA&s=10",
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
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_55nsrg0LXovyH5MSSz6LaNVrGZdzqFHD0JS_sszQFJwN3fL9XndBRZ0&s=10',
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
    image_url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=600',
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
  },
  {
    id: 'dish_8',
    dish_name: 'Gà sốt mè quinoa',
    description: 'Ức gà áp chảo ăn cùng quinoa, bông cải xanh và sốt mè rang nhẹ vị cho bữa trưa giàu protein.',
    image_url: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein'],
    ingredients: ['Ức gà', 'Hạt diêm mạch', 'Bông cải xanh', 'Mè', 'Sốt mè rang'],
    rating_avg: 4.7,
    reviews_count: 68,
    sizes: [
      { id: 'sz_8_s', size_name: 'S', price: 79000, calories: 360, protein: 29, fat: 9, carb: 34 },
      { id: 'sz_8_m', size_name: 'M', price: 92000, calories: 455, protein: 38, fat: 12, carb: 45 },
      { id: 'sz_8_l', size_name: 'L', price: 108000, calories: 560, protein: 48, fat: 15, carb: 56 }
    ],
    reviews: []
  },
  {
    id: 'dish_9',
    dish_name: 'Mì Ý bí ngòi tôm',
    description: 'Sợi bí ngòi low carb xào tôm, cà chua bi và sốt thảo mộc cho bữa tối nhẹ bụng.',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Low Carb', 'Giàu Protein'],
    ingredients: ['Tôm', 'Bí ngòi', 'Cà chua', 'Dầu ô liu', 'Sốt thảo mộc'],
    rating_avg: 4.6,
    reviews_count: 44,
    sizes: [
      { id: 'sz_9_s', size_name: 'S', price: 88000, calories: 300, protein: 24, fat: 10, carb: 18 },
      { id: 'sz_9_m', size_name: 'M', price: 105000, calories: 390, protein: 32, fat: 14, carb: 25 },
      { id: 'sz_9_l', size_name: 'L', price: 124000, calories: 480, protein: 40, fat: 18, carb: 32 }
    ],
    reviews: []
  },
  {
    id: 'dish_10',
    dish_name: 'Yến mạch berry',
    description: 'Yến mạch ngâm sữa hạt, ăn kèm dâu, việt quất và hạt chia cho bữa sáng no lâu.',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHOIX-O5Rqzn9MRkBeL8aOxvC333LfD2fxT1f2ComngA&s=10',
    status: 'Active',
    category_name: 'Ăn sáng',
    diet_tags: ['Thuần chay'],
    ingredients: ['Yến mạch', 'Sữa hạt', 'Dâu', 'Việt quất', 'Hạt chia'],
    rating_avg: 4.8,
    reviews_count: 91,
    sizes: [
      { id: 'sz_10_s', size_name: 'S', price: 52000, calories: 260, protein: 8, fat: 7, carb: 38 },
      { id: 'sz_10_m', size_name: 'M', price: 65000, calories: 340, protein: 11, fat: 10, carb: 50 },
      { id: 'sz_10_l', size_name: 'L', price: 78000, calories: 430, protein: 14, fat: 13, carb: 62 }
    ],
    reviews: []
  },
  {
    id: 'dish_11',
    dish_name: 'Trứng cuộn rau bina',
    description: 'Trứng cuộn cùng rau bina, nấm và cà chua bi, phù hợp bữa sáng ít carb.',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Ăn sáng',
    diet_tags: ['Keto Friendly', 'Low Carb'],
    ingredients: ['Trứng', 'Rau bina', 'Nấm', 'Cà chua', 'Phô mai'],
    rating_avg: 4.7,
    reviews_count: 58,
    sizes: [
      { id: 'sz_11_s', size_name: 'S', price: 59000, calories: 280, protein: 18, fat: 18, carb: 8 },
      { id: 'sz_11_m', size_name: 'M', price: 72000, calories: 360, protein: 24, fat: 24, carb: 10 },
      { id: 'sz_11_l', size_name: 'L', price: 86000, calories: 450, protein: 30, fat: 30, carb: 13 }
    ],
    reviews: []
  },
  {
    id: 'dish_12',
    dish_name: 'Salad cá ngừ sốt chanh',
    description: 'Cá ngừ áp chảo, rau rocket, đậu que và sốt chanh dầu ô liu thanh nhẹ.',
    image_url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Salad',
    diet_tags: ['Giàu Protein', 'Low Carb'],
    ingredients: ['Cá ngừ', 'Rau rocket', 'Đậu que', 'Dầu ô liu', 'Chanh'],
    rating_avg: 4.8,
    reviews_count: 73,
    sizes: [
      { id: 'sz_12_s', size_name: 'S', price: 86000, calories: 310, protein: 26, fat: 12, carb: 12 },
      { id: 'sz_12_m', size_name: 'M', price: 104000, calories: 405, protein: 34, fat: 16, carb: 16 },
      { id: 'sz_12_l', size_name: 'L', price: 122000, calories: 500, protein: 42, fat: 20, carb: 22 }
    ],
    reviews: []
  },
  {
    id: 'dish_13',
    dish_name: 'Wrap gà nguyên cám',
    description: 'Bánh wrap nguyên cám cuộn ức gà, rau giòn và sốt sữa chua tỏi.',
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Ăn nhẹ',
    diet_tags: ['Giàu Protein'],
    ingredients: ['Ức gà', 'Bánh mì nguyên cám', 'Sữa chua', 'Rau xà lách', 'Cà chua'],
    rating_avg: 4.5,
    reviews_count: 39,
    sizes: [
      { id: 'sz_13_s', size_name: 'S', price: 56000, calories: 300, protein: 20, fat: 8, carb: 34 },
      { id: 'sz_13_m', size_name: 'M', price: 69000, calories: 390, protein: 27, fat: 11, carb: 45 },
      { id: 'sz_13_l', size_name: 'L', price: 83000, calories: 480, protein: 34, fat: 14, carb: 56 }
    ],
    reviews: []
  },
  {
    id: 'dish_14',
    dish_name: 'Súp bí đỏ hạt điều',
    description: 'Súp bí đỏ xay mịn với hạt điều rang, kem thực vật và bánh mì nguyên cám giòn.',
    image_url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Ăn nhẹ',
    diet_tags: ['Thuần chay'],
    ingredients: ['Bí đỏ', 'Hạt điều', 'Kem thực vật', 'Bánh mì nguyên cám'],
    rating_avg: 4.4,
    reviews_count: 31,
    sizes: [
      { id: 'sz_14_s', size_name: 'S', price: 49000, calories: 220, protein: 6, fat: 9, carb: 28 },
      { id: 'sz_14_m', size_name: 'M', price: 62000, calories: 310, protein: 9, fat: 13, carb: 40 },
      { id: 'sz_14_l', size_name: 'L', price: 76000, calories: 390, protein: 12, fat: 17, carb: 50 }
    ],
    reviews: []
  },
  {
    id: 'dish_15',
    dish_name: 'Cơm bò kim chi',
    description: 'Bò áp chảo ăn cùng cơm gạo lứt, kim chi ít đường, rau củ và trứng lòng đào.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein'],
    ingredients: ['Thịt bò thăn', 'Gạo lứt', 'Kim chi', 'Trứng', 'Rau củ'],
    rating_avg: 4.9,
    reviews_count: 112,
    sizes: [
      { id: 'sz_15_s', size_name: 'S', price: 89000, calories: 410, protein: 28, fat: 13, carb: 42 },
      { id: 'sz_15_m', size_name: 'M', price: 109000, calories: 520, protein: 37, fat: 17, carb: 54 },
      { id: 'sz_15_l', size_name: 'L', price: 128000, calories: 640, protein: 46, fat: 21, carb: 68 }
    ],
    reviews: []
  },
  {
    id: 'dish_16',
    dish_name: 'Đậu hũ sốt nấm',
    description: 'Đậu hũ non áp chảo với sốt nấm đông cô, cải thìa và cơm gạo lứt.',
    image_url: 'https://images.unsplash.com/photo-1617692855027-33b14f061079?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Thuần chay', 'Low Carb'],
    ingredients: ['Đậu hũ', 'Nấm đông cô', 'Cải thìa', 'Gạo lứt', 'Đậu nành'],
    rating_avg: 4.6,
    reviews_count: 47,
    sizes: [
      { id: 'sz_16_s', size_name: 'S', price: 68000, calories: 320, protein: 16, fat: 10, carb: 36 },
      { id: 'sz_16_m', size_name: 'M', price: 82000, calories: 410, protein: 22, fat: 14, carb: 46 },
      { id: 'sz_16_l', size_name: 'L', price: 98000, calories: 510, protein: 28, fat: 18, carb: 58 }
    ],
    reviews: []
  },
  {
    id: 'dish_17',
    dish_name: 'Sinh tố xoài protein',
    description: 'Sinh tố xoài, chuối, sữa hạt và protein thực vật, phù hợp sau vận động.',
    image_url: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Nước ép',
    diet_tags: ['Giàu Protein', 'Thuần chay'],
    ingredients: ['Xoài', 'Chuối', 'Sữa hạt', 'Protein thực vật'],
    rating_avg: 4.7,
    reviews_count: 66,
    sizes: [
      { id: 'sz_17_s', size_name: 'S', price: 52000, calories: 190, protein: 14, fat: 4, carb: 26 },
      { id: 'sz_17_m', size_name: 'M', price: 65000, calories: 280, protein: 22, fat: 6, carb: 38 },
      { id: 'sz_17_l', size_name: 'L', price: 79000, calories: 360, protein: 30, fat: 8, carb: 48 }
    ],
    reviews: []
  },
  {
    id: 'dish_18',
    dish_name: 'Cá basa nướng nghệ',
    description: 'Cá basa nướng nghệ, rau củ hấp và cơm gạo lứt cho khẩu phần cân bằng.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
    status: 'Active',
    category_name: 'Món chính',
    diet_tags: ['Giàu Protein', 'Low Carb'],
    ingredients: ['Cá basa', 'Nghệ', 'Gạo lứt', 'Bông cải xanh', 'Cà rốt'],
    rating_avg: 4.5,
    reviews_count: 35,
    sizes: [
      { id: 'sz_18_s', size_name: 'S', price: 72000, calories: 340, protein: 25, fat: 9, carb: 34 },
      { id: 'sz_18_m', size_name: 'M', price: 89000, calories: 430, protein: 33, fat: 12, carb: 44 },
      { id: 'sz_18_l', size_name: 'L', price: 106000, calories: 540, protein: 42, fat: 15, carb: 56 }
    ],
    reviews: []
  }
];
