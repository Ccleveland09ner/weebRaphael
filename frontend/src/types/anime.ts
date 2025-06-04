import { User } from './auth';

export interface Anime {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  genres: string[];
  popularity?: number;
  status?: string;
}

export interface FavoriteAnime extends Anime {
  addedAt: string;
  user?: User;
}

export interface WatchedAnime extends Anime {
  watchedAt: string;
  userRating?: number;
  review?: string;
  user?: User;
}

export interface AnimeRecommendation extends Anime {
  matchScore: number;
  reasonForRecommendation?: string;
  isViewed: boolean;
}

export interface AnimeStats {
  favoritesCount: number;
  watchedCount: number;
  averageRating: number;
  topGenres: string[];
  totalHoursWatched?: number;
  recommendationAccuracy?: number;
}

export interface AnimeFilter {
  genre?: string;
  rating?: number;
  status?: string;
  sort?: 'popularity' | 'rating' | 'title' | 'releaseDate';
  order?: 'asc' | 'desc';
}