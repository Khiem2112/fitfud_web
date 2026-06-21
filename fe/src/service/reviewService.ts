export const createDishReview = async (reviewData: { orderId: string, dishId: string, rating: number, comment: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const stored = localStorage.getItem('fitfud_reviews');
  const reviews = stored ? JSON.parse(stored) : [];
  
  // Check if already reviewed
  const existingReview = reviews.find((r: any) => r.orderId === reviewData.orderId && r.dishId === reviewData.dishId);
  if (existingReview) {
    throw new Error('Bạn đã đánh giá món ăn này rồi!');
  }
  
  const newReview = {
    id: `rev_${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  
  reviews.push(newReview);
  localStorage.setItem('fitfud_reviews', JSON.stringify(reviews));
  
  return { success: true, review: newReview };
};

export const getOrderReviews = async (orderId: string) => {
  const stored = localStorage.getItem('fitfud_reviews');
  const reviews = stored ? JSON.parse(stored) : [];
  return reviews.filter((r: any) => r.orderId === orderId);
};
