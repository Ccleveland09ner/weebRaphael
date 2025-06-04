import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { anime } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import type { WatchedAnime } from '../types/anime';

export function Watched() {
  const bgColor = useColorModeValue('brand.black', 'brand.grey');

  const { data: watched, isLoading } = useQuery<WatchedAnime[]>({
    queryKey: ['watched'],
    queryFn: () => anime.getWatched()
  });

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <Heading color="brand.white" mb={6}>
          Watched Anime
        </Heading>
        {isLoading ? (
          <Text color="brand.white">Loading watched anime...</Text>
        ) : watched?.length === 0 ? (
          <Text color="brand.white">No watched anime yet. Start tracking your progress!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {watched?.map((anime) => (
              <AnimeCard
                key={anime.anime_id}
                id={anime.anime_id}
                title={anime.title}
                rating={anime.rating}
                isWatched={true}
                onWatchedToggle={() => {}}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Watched; 