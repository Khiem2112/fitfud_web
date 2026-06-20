import { useQuery } from '@tanstack/react-query';
import { fetchCities, fetchDistricts, fetchWards } from '../service/checkoutService';

export const useLocation = (cityId, districtId) => {
  const citiesQuery = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  const districtsQuery = useQuery({
    queryKey: ['districts', cityId],
    queryFn: () => fetchDistricts(cityId),
    enabled: !!cityId,
  });

  const wardsQuery = useQuery({
    queryKey: ['wards', districtId],
    queryFn: () => fetchWards(districtId),
    enabled: !!districtId,
  });

  return {
    cities: citiesQuery.data || [],
    districts: districtsQuery.data || [],
    wards: wardsQuery.data || [],
    isLoadingCities: citiesQuery.isLoading,
    isLoadingDistricts: districtsQuery.isLoading,
    isLoadingWards: wardsQuery.isLoading,
  };
};
