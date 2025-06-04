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
import type { FavouriteAnime } from '../types/anime';

export function Favorites() {
  const bgColor = useColorModeValue('brand.black', 'brand.grey');

  const { data: favorites, isLoading } = useQuery<FavouriteAnime[]>({
    queryKey: ['favorites'],
    queryFn: () => anime.getFavorites()
  });

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <Heading color="brand.white" mb={6}>
          My Favorites
        </Heading>
        {isLoading ? (
          <Text color="brand.white">Loading favorites...</Text>
        ) : favorites?.length === 0 ? (
          <Text color="brand.white">No favorites yet. Start adding some!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {favorites?.map((anime) => (
              <AnimeCard
                key={anime.anime_id}
                id={anime.anime_id}
                title={anime.title}
                isFavorite={true}
                onFavoriteToggle={() => {}}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Favorites; 