import { useQuery } from '@tanstack/react-query';
import { fetchSurveyMasterData } from '../service/surveyService';
import { SurveyMasterDataOutput } from '../type/survey.types';

export const useSurveyMasterData = () => {
  return useQuery<SurveyMasterDataOutput>({
    queryKey: ['surveyMasterData'],
    queryFn: fetchSurveyMasterData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (Master data doesn't change often)
    refetchOnWindowFocus: false,
  });
};
