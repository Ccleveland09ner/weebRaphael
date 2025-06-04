export interface Anime {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  rating: number;
  genres: string[];
}

export interface FavoriteAnime extends Anime {
  addedAt: string;
}

export interface WatchedAnime extends Anime {
  watchedAt: string;
  userRating: number;
}

export interface AnimeRecommendation extends Anime {
  matchScore: number;
  reasonForRecommendation: string;
}

export interface AnimeStats {
  favoritesCount: number;
  watchedCount: number;
  averageRating: number;
  topGenres: string[];
}