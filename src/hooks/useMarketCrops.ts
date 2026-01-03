import { useQuery } from '@tanstack/react-query';
import { GarakMarketService } from '@/services/garakMarketService';

export const GARAK_KEYS = {
  all: ['garak'] as const,
  search: (query: string) => [...GARAK_KEYS.all, 'search', query] as const,
  recommendations: (location: string, facility: string) =>
    [...GARAK_KEYS.all, 'recommendations', location, facility] as const,
};

export function useSearchCrops(query: string) {
  return useQuery({
    queryKey: GARAK_KEYS.search(query),
    queryFn: () => GarakMarketService.searchCrops(query),
    enabled: query.length >= 1, // Only search if query is at least 1 char
    staleTime: 1000 * 60 * 60, // 1 hour (Market items rarely change abruptly in name)
  });
}

export function useMarketRecommendations(location: string, facilityType: string) {
  return useQuery({
    queryKey: GARAK_KEYS.recommendations(location, facilityType),
    queryFn: () => Promise.resolve(GarakMarketService.getRecommendations(location, facilityType)),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (Recommendations are seasonal)
  });
}
