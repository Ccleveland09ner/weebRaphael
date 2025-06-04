import { SimpleGrid } from '@chakra-ui/react';
import { Anime } from '../types/anime';
import AnimeCard from './AnimeCard';
import InfiniteScroll from 'react-infinite-scroll-component';

interface AnimeGridProps {
  animes: Anime[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  favorites?: number[];
  watched?: number[];
}

export default function AnimeGrid({ animes, hasMore = false, onLoadMore, favorites = [], watched = [] }: AnimeGridProps) {
  return (
    <InfiniteScroll
      dataLength={animes.length}
      next={onLoadMore || (() => {})}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {animes.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            isFavorite={favorites.includes(anime.id)}
            isWatched={watched.includes(anime.id)}
          />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}