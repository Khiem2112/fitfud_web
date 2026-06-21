import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserOrders, lookupGuestOrders } from '../service/ordersService';

export const useUserOrders = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['userOrders', userId],
    queryFn: () => getUserOrders(userId!),
    enabled: !!userId,
  });
};

export const useGuestOrdersMutation = () => {
  return useMutation({
    mutationFn: (phone: string) => lookupGuestOrders(phone),
  });
};
