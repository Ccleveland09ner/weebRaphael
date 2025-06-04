import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Input,
  Button,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { anime } from '../services/api';
import { AnimeCard } from '../components/AnimeCard';
import type { AnimeRecommendation, AnimeStats } from '../types/anime';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('brand.black', 'brand.grey');

  const { data: favorites } = useQuery(['favorites'], () => anime.getFavorites());
  const { data: watched } = useQuery(['watched'], () => anime.getWatched());
  const { data: recommendations } = useQuery(['recommendations', searchQuery], 
    () => searchQuery ? anime.getRecommendations(searchQuery) : null,
    { enabled: !!searchQuery }
  );

  const { data: stats } = useQuery(['stats'], () => anime.getStats());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically trigger due to the useQuery dependency
  };

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <Box
            h="70vh"
            bgImage="url('https://images.pexels.com/photos/7234263/pexels-photo-7234263.jpeg')"
            bgSize="cover"
            bgPosition="center"
            position="relative"
            borderRadius="xl"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(0,0,0,0.7)"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              p={8}
            >
              <Heading size="2xl" color="white" mb={4}>
                Discover Your Next Anime
              </Heading>
              <Text fontSize="xl" color="white" mb={8}>
                Get personalized recommendations based on your interests
              </Text>
              <form onSubmit={handleSearch}>
                <Flex maxW="600px">
                  <Input
                    placeholder="Search for anime recommendations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                    bg="white"
                    color="black"
                    mr={4}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    colorScheme="blue"
                    px={8}
                  >
                    Search
                  </Button>
                </Flex>
              </form>
            </Box>
          </Box>

          {/* Search Results */}
          {recommendations && recommendations.length > 0 && (
            <Box>
              <Heading color="brand.white" mb={6}>
                Search Results
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {recommendations.map((anime) => (
                  <AnimeCard
                    key={anime.anime_id}
                    id={anime.anime_id}
                    title={anime.title}
                    rating={anime.rating}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Favorites Section */}
          {favorites && favorites.length > 0 && (
            <Box>
              <Heading color="brand.white" mb={6}>
                Your Favorites
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {favorites.map((anime) => (
                  <AnimeCard
                    key={anime.anime_id}
                    id={anime.anime_id}
                    title={anime.title}
                    isFavorite={true}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Watched Section */}
          {watched && watched.length > 0 && (
            <Box>
              <Heading color="brand.white" mb={6}>
                Continue Watching
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {watched.map((anime) => (
                  <AnimeCard
                    key={anime.anime_id}
                    id={anime.anime_id}
                    title={anime.title}
                    rating={anime.rating}
                    isWatched={true}
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Stats Section */}
          {stats && (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
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
                  {stats.average_rating?.toFixed(1) || '0.0'}
                </Text>
                <Text color="brand.white">Average Rating</Text>
              </Box>
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;