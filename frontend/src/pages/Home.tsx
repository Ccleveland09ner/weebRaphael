import { Box, Container, Heading, Text, VStack, SimpleGrid, Input, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/api';
import AnimeCard from '../components/AnimeCard';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', searchQuery],
    queryFn: () => animeService.getRecommendations(searchQuery),
    enabled: !!searchQuery
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically run due to the searchQuery dependency
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box bg="brand.600" color="white" p={8} borderRadius="xl" textAlign="center">
          <Heading size="2xl" mb={4}>
            Discover Your Next Favorite Anime
          </Heading>
          <Text fontSize="xl" mb={8}>
            Get personalized recommendations based on your interests
          </Text>
          
          <Box as="form" onSubmit={handleSearch} maxW="600px" mx="auto">
            <Input
              placeholder="What kind of anime are you looking for?"
              bg="white"
              color="gray.800"
              size="lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="lg" mt={4}>
              Get Recommendations
            </Button>
          </Box>
        </Box>

        {recommendations && recommendations.length > 0 && (
          <Box>
            <Heading size="lg" mb={6}>
              Recommended for You
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {recommendations.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </VStack>
    </Container>
  );
}