import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { anime } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import type { AnimeRecommendation, AnimeStats } from '../types/anime';

export function Home() {
  const bgColor = useColorModeValue('brand.black', 'brand.grey');

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery<AnimeRecommendation[]>({
    queryKey: ['recommendations'],
    queryFn: () => anime.getRecommendations()
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<AnimeStats>({
    queryKey: ['stats'],
    queryFn: () => anime.getStats()
  });

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <VStack gap={8} align="stretch">
          {/* Hero Section */}
          <Box
            h="500px"
            bgGradient="linear(to-br, brand.blue, brand.grey)"
            borderRadius="xl"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0, 0, 0, 0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack gap={4} textAlign="center" color="white">
                <Heading size="2xl">Welcome to WeebRaphael</Heading>
                <Text fontSize="xl">
                  Your ultimate anime recommendation platform
                </Text>
              </VStack>
            </Box>
          </Box>

          {/* Recommendations Section */}
          <Box>
            <Heading color="brand.white" mb={6}>
              Recommended for You
            </Heading>
            {isLoadingRecommendations ? (
              <Text color="brand.white">Loading recommendations...</Text>
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
          </Box>

          {/* Stats Section */}
          <Box>
            <Heading color="brand.white" mb={6}>
              Your Anime Journey
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <Box
                bg="brand.blue"
                p={6}
                borderRadius="lg"
                textAlign="center"
              >
                <Text fontSize="2xl" color="brand.white">
                  {stats?.favorites_count || 0}
                </Text>
                <Text color="brand.white">Favorites</Text>
              </Box>
              <Box
                bg="brand.blue"
                p={6}
                borderRadius="lg"
                textAlign="center"
              >
                <Text fontSize="2xl" color="brand.white">
                  {stats?.watched_count || 0}
                </Text>
                <Text color="brand.white">Watched</Text>
              </Box>
              <Box
                bg="brand.blue"
                p={6}
                borderRadius="lg"
                textAlign="center"
              >
                <Text fontSize="2xl" color="brand.white">
                  {stats?.average_rating?.toFixed(1) || '0.0'}
                </Text>
                <Text color="brand.white">Average Rating</Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

          {!isLoadingStats && stats && (
            <Box bg={sectionBgColor} p={6} borderRadius="xl">
              <Heading size="lg" mb={6} color="brand.white">
                Your Anime Journey
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Box
                  bg="brand.blue"
                  p={6}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="2xl" color="brand.white">
                    {stats.favorites_count}
                  </Text>
                  <Text color="brand.white">Favorites</Text>
                </Box>
                <Box
                  bg="brand.blue"
                  p={6}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="2xl" color="brand.white">
                    {stats.watched_count}
                  </Text>
                  <Text color="brand.white">Watched</Text>
                </Box>
                <Box
                  bg="brand.blue"
                  p={6}
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="2xl" color="brand.white">
                    {stats.average_rating.toFixed(1)}
                  </Text>
                  <Text color="brand.white">Average Rating</Text>
                </Box>
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 