import { useQuery } from '@tanstack/react-query';
import { getOrderDetail } from '../service/ordersService';
import { fetchDishDetail } from '../service/menuService';
import { OrderDetail } from '../type/orders.types';

export const useOrderDetail = (orderId: string | undefined) => {
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const fullOrder = await getOrderDetail(orderId);
      
      // Deep copy items so we can enrich them
      const enrichedItems = [...fullOrder.items];
      let calSum = 0;
      
      for (let i = 0; i < enrichedItems.length; i++) {
        const item = enrichedItems[i];
        if (item.dish_id) {
          try {
            const dish = await fetchDishDetail(item.dish_id);
            // enrich item with fresh data from menu
            item.dish_name = dish.dish_name;
            item.image_url = dish.image_url;
            
            const sizeData = dish.sizes.find(s => s.size_name === item.size_name);
            const cal = sizeData ? sizeData.calories : (dish.sizes[0]?.calories || 0);
            calSum += cal * item.quantity;
          } catch(e) {
            // ignore if dish not found
          }
        }
      }
      
      return { 
        ...fullOrder, 
        items: enrichedItems,
        totalCalories: calSum
      } as OrderDetail & { totalCalories: number };
    },
    enabled: !!orderId,
  });
};
