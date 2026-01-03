import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FieldService } from '@/services/fieldService';
import { WeatherService } from '@/services/weatherService';
import { KamisService } from '@/services/kamisService';
import type { Field } from '@/types/farm';

// Type Keys for Query Cache
export const QUERY_KEYS = {
  FIELDS: ['fields'],
  WEATHER: (lat: number, lng: number) => ['weather', lat, lng],
  MARKET: (category?: string) => ['market', category || 'all'],
  CROP_CYCLES: ['cropCycles'],
};

// --- Field Hooks ---

export function useFields() {
  return useQuery({
    queryKey: QUERY_KEYS.FIELDS,
    queryFn: () => FieldService.getFields(),
    staleTime: 0, // Always fetch fresh from localStorage
    gcTime: 0, // Don't cache garbage
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useFieldMutation() {
  const queryClient = useQueryClient();

  const addField = useMutation({
    mutationFn: async (field: Field) => {
      // Simulate async for consistency, though localStorage is sync
      FieldService.saveField(field);
      return field;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FIELDS });
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      FieldService.deleteField(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FIELDS });
    },
  });

  return { addField, deleteField };
}

// --- Weather Hooks ---

export function useWeather(lat?: number, lng?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.WEATHER(lat || 0, lng || 0),
    queryFn: async () => {
        if (!lat || !lng) throw new Error("Coordinates required");
        return WeatherService.getRealtimeWeather(lat, lng);
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 30, // 30 minutes (Weather doesn't change that fast)
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 1,
  });
}

// --- Market Hooks ---

export function useMarketPrices(_activeCrops?: Set<string>) {
  return useQuery({
    queryKey: QUERY_KEYS.MARKET('all'),
    queryFn: async () => {
      // Fetch major crops as a baseline
      return KamisService.fetchAllMajorCrops();
    },
    staleTime: 1000 * 60 * 60 * 2, // 2 hours (Market prices are daily)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useActiveCrops() {
  return useQuery({
    queryKey: QUERY_KEYS.CROP_CYCLES,
    queryFn: () => {
       // TODO: Fetch from actual crop plans or field status
       return [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
