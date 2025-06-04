import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/api';
import { AnimeFilter } from '../types/anime';

export function useAnimeData(type: 'popular' | 'top-rated' | 'recommendations', filters?: AnimeFilter) {
  const queryFn = async () => {
    switch (type) {
      case 'popular':
        return animeService.getPopularAnime(filters);
      case 'top-rated':
        return animeService.getTopRatedAnime(filters);
      case 'recommendations':
        return animeService.getRecommendations(undefined, filters);
      default:
        return [];
    }
  };

  return useQuery({
    queryKey: [type, filters],
    queryFn,
  });
}

export function useUserAnimeData() {
  const favorites = useQuery({
    queryKey: ['favorites'],
    queryFn: () => animeService.getFavorites(),
  });

  const watched = useQuery({
    queryKey: ['watched'],
    queryFn: () => animeService.getWatched(),
  });

  const stats = useQuery({
    queryKey: ['animeStats'],
    queryFn: () => animeService.getStats(),
  });

  return {
    favorites,
    watched,
    stats,
    isLoading: favorites.isLoading || watched.isLoading || stats.isLoading,
  };
}