export interface FavouriteAnime {
  anime_id: number;
  title: string;
  added_at: string;
}

export interface WatchedAnime {
  anime_id: number;
  title: string;
  watched_at: string;
  rating?: number;
}

export interface AnimeRecommendation {
  anime_id: number;
  title: string;
  recommended_at: string;
  is_viewed: boolean;
  rating?: number;
}

export interface AnimeStats {
  favorites_count: number;
  watched_count: number;
  unviewed_recommendations: number;
  average_rating: number;
}