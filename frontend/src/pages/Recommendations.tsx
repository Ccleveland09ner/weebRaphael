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
import type { AnimeRecommendation } from '../types/anime';

export function Recommendations() {
  const bgColor = useColorModeValue('brand.black', 'brand.grey');

  const { data: recommendations, isLoading } = useQuery<AnimeRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: () => anime.getRecommendations()
  });

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <Heading color="brand.white" mb={6}>
          Recommended for You
        </Heading>
        {isLoading ? (
          <Text color="brand.white">Loading recommendations...</Text>
        ) : recommendations?.length === 0 ? (
          <Text color="brand.white">No recommendations available yet. Add some favorites to get personalized recommendations!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
            {recommendations?.map((anime) => (
              <AnimeCard
                key={anime.anime_id}
                id={anime.anime_id}
                title={anime.title}
                rating={anime.rating}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

export default Recommendations; 