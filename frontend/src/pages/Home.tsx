import { Box, Container, Heading, Text, VStack, Input, Button, SimpleGrid, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', searchQuery],
    queryFn: () => animeService.getRecommendations(searchQuery),
    enabled: !!searchQuery
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box>
      <Box
        bg="brand.500"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch" maxW="800px" mx="auto" textAlign="center">
            <Heading size="2xl" lineHeight="1.2">
              Discover Your Next Favorite Anime
            </Heading>
            <Text fontSize="xl" opacity={0.9}>
              Get personalized recommendations based on your interests
            </Text>
            
            <Box as="form" onSubmit={handleSearch}>
              <InputGroup size="lg">
                <Input
                  placeholder="What kind of anime are you looking for?"
                  bg="white"
                  color="gray.800"
                  _placeholder={{ color: 'gray.500' }}
                  borderRadius="full"
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  pr="4.5rem"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    type="submit"
                    colorScheme="brand"
                    borderRadius="full"
                  >
                    <FiSearch />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl" py={12}>
        {recommendations && recommendations.length > 0 && (
          <VStack spacing={8} align="stretch">
            <Heading size="lg" color="gray.800">
              Recommended for You
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {recommendations.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </Container>
    </Box>
  );
}